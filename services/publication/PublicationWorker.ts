import { prisma } from '../../lib/prisma';
import { PublicationAdapterFactory } from './PublicationAdapterFactory';
import { OfferRevalidationService } from './OfferRevalidationService';
import { PublicationPersistenceService } from './PublicationPersistenceService';
import { RateLimitService } from './RateLimitService';
import { WhatsAppService } from './WhatsAppService';
import { EmailService } from './EmailService';
import { Logger } from '../../lib/logger';
import { SystemConfigService } from '../core/SystemConfigService';
import { AntiSpamEngine } from '../core/AntiSpamEngine';
import { TrackingEngine } from '../tracking/TrackingEngine';

export class PublicationWorker {
  private workerId: string;

  constructor(workerId = `worker_${Date.now()}`) {
    this.workerId = workerId;
  }

  /**
   * Processa os próximos itens pendentes na fila utilizando trava lógica/transação para evitar concorrência.
   */
  public async processPendingQueue(batchSize = 10): Promise<{ processed: number; successful: number; failed: number; errors?: any[] }> {
    let processed = 0;
    let successful = 0;
    let failed = 0;
    const errors = [];

    const isGlobalEnabled = await SystemConfigService.isGlobalAutopilotEnabled();
    if (!isGlobalEnabled) {
      Logger.warn('PUBLICATION_WORKER', 'KILL_SWITCH', 'Global Autopilot Kill Switch is active. Halting publication.');
      return { processed: 0, successful: 0, failed: 0, errors: [{ id: 'system', message: 'AUTOPILOT_ENABLED=false' }] };
    }

    try {
      // Buscar itens pendentes
      const pendingItems = await prisma.publicationQueueItem.findMany({
        where: {
          status: 'PENDING',
          scheduledAt: { lte: new Date() },
        },
        take: batchSize,
        include: {
          publication: {
            include: {
              contentPackage: { include: { product: true } },
            },
          },
        },
      });

      for (const item of pendingItems) {
        // Tentar travar o item atomicamente
        const locked = await prisma.publicationQueueItem.updateMany({
          where: {
            id: item.id,
            status: 'PENDING',
          },
          data: {
            status: 'PROCESSING',
            workerId: this.workerId,
            lockedAt: new Date(),
          },
        });

        if (locked.count === 0) {
          // Outro worker já assumiu o item
          continue;
        }

        processed++;
        const pub = item.publication;

        try {
          // 1. Revalidação de Oferta
          const reval = await OfferRevalidationService.revalidateProduct(pub.productId);
          if (!reval.valid) {
            await PublicationPersistenceService.updatePublicationResult(pub.id, 'EXPIRED', {
              errorMessage: `Oferta expirada ou indisponível: ${reval.reason}`,
            });
            await prisma.publicationQueueItem.update({ where: { id: item.id }, data: { status: 'FAILED' } });
            failed++;
            continue;
          }

          // 1.5 Anti-Spam Check
          const antiSpam = await AntiSpamEngine.isAllowedToPublish(pub.productId, pub.channel, pub.contentPackage.product.category, pub.contentPackage.product.brand);
          if (!antiSpam.allowed) {
             await PublicationPersistenceService.updatePublicationResult(pub.id, 'FAILED', {
              errorMessage: `Anti-Spam bloqueou: ${antiSpam.reason}`,
            });
            await prisma.publicationQueueItem.update({ where: { id: item.id }, data: { status: 'FAILED' } });
            failed++;
            continue;
          }

          // 2. Filtro de Consentimento (WhatsApp / Email)
          if (pub.channel === 'WHATSAPP' && pub.metadata) {
            const phone = (pub.metadata as any).recipientPhone;
            if (phone) {
              await WhatsAppService.canSendToPhone(phone);
            }
          } else if (pub.channel === 'EMAIL' && pub.metadata) {
            const email = (pub.metadata as any).recipientEmail;
            if (email) {
              await EmailService.canSendToEmail(email);
            }
          }

          // 3. Controle de Rate Limit
          await RateLimitService.checkRateLimit(pub.channel, pub.accountId || undefined);

          // 4. Executar Publicação no Adapter correspondente
          const adapter = PublicationAdapterFactory.getAdapter(pub.channel);

          const trackingUrl = TrackingEngine.generateTrackingUrl(pub.id);
          const originalUrl = pub.contentPackage.product.url;
          
          let body = pub.contentPackage.caption;
          // Replace original URL with Tracking URL in body
          if (body && originalUrl) {
            // using string split/join or replaceAll for safety
            body = body.split(originalUrl).join(trackingUrl);
          }

          const payload = (pub.publicationPayload as any) || {
            title: pub.contentPackage.title,
            body: body,
            trackingUrl: trackingUrl,
            affiliateDisclosure: pub.contentPackage.affiliateDisclosure || '#afiliado',
            cta: pub.contentPackage.cta,
          };

          const isDryRun = await SystemConfigService.isDryRun();
          let result;

          if (isDryRun) {
            Logger.info('PUBLICATION_WORKER', 'DRY_RUN', `Dry run ativo. Publicação simulada para ${pub.id}`);
            result = {
              success: true,
              status: 'PUBLISHED',
              externalPublicationId: `dry_run_${Date.now()}`,
              externalUrl: trackingUrl,
              errorMessage: undefined
            };
          } else {
            result = await adapter.publish(payload, pub.accountId || undefined);
          }
          await PublicationPersistenceService.updatePublicationResult(pub.id, result.status as any, {
            externalPublicationId: result.externalPublicationId,
            externalUrl: result.externalUrl,
            errorMessage: result.errorMessage,
            publicationPayload: result.manualPackage ? result.manualPackage : undefined,
          });

          if (result.status === 'FAILED') {
            await prisma.publicationQueueItem.update({
              where: { id: item.id },
              data: { status: 'FAILED' },
            });
            failed++;
            errors.push({ id: item.id, message: result.errorMessage || 'Unknown error' });
          } else {
            await prisma.publicationQueueItem.update({
              where: { id: item.id },
              data: { status: 'COMPLETED' },
            });
            successful++;
          }
        } catch (err: any) {
          failed++;
          Logger.error('PUBLICATION_WORKER', 'ITEM_FAILED', `Falha ao processar item ${item.id}: ${err.message}`);

          await PublicationPersistenceService.updatePublicationResult(pub.id, 'FAILED', {
            errorMessage: err.message,
          });

          await prisma.publicationQueueItem.update({
            where: { id: item.id },
            data: { status: 'FAILED', attempts: item.attempts + 1 },
          });
          errors.push({ id: item.id, message: err.message });
        }
      }
    } catch (err: any) {
      Logger.error('PUBLICATION_WORKER', 'QUEUE_ERROR', `Erro geral no worker: ${err.message}`);
      errors.push({ id: 'system', message: err.message });
    }

    return { processed, successful, failed, errors };
  }
}
