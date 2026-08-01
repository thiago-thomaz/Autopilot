import { prisma } from '../../lib/prisma';
import { PublicationAdapterFactory } from './PublicationAdapterFactory';
import { OfferRevalidationService } from './OfferRevalidationService';
import { PublicationPersistenceService } from './PublicationPersistenceService';
import { RateLimitService } from './RateLimitService';
import { WhatsAppService } from './WhatsAppService';
import { EmailService } from './EmailService';
import { Logger } from '../../lib/logger';

export class PublicationWorker {
  private workerId: string;

  constructor(workerId = `worker_${Date.now()}`) {
    this.workerId = workerId;
  }

  /**
   * Processa os próximos itens pendentes na fila utilizando trava lógica/transação para evitar concorrência.
   */
  public async processPendingQueue(batchSize = 10): Promise<{ processed: number; successful: number; failed: number }> {
    let processed = 0;
    let successful = 0;
    let failed = 0;

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
          const payload = (pub.publicationPayload as any) || {
            title: pub.contentPackage.title,
            body: pub.contentPackage.caption,
            trackingUrl: pub.trackingUrl || pub.contentPackage.product.url,
            affiliateDisclosure: pub.contentPackage.affiliateDisclosure || '#afiliado',
            cta: pub.contentPackage.cta,
          };

          const result = await adapter.publish(payload, pub.accountId || undefined);

          // 5. Persistir Resultado no Banco
          await PublicationPersistenceService.updatePublicationResult(pub.id, result.status, {
            externalPublicationId: result.externalPublicationId,
            externalUrl: result.externalUrl,
            errorMessage: result.errorMessage,
            publicationPayload: result.manualPackage ? result.manualPackage : undefined,
          });

          await prisma.publicationQueueItem.update({
            where: { id: item.id },
            data: { status: 'COMPLETED' },
          });

          successful++;
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
        }
      }
    } catch (err: any) {
      Logger.error('PUBLICATION_WORKER', 'QUEUE_ERROR', `Erro geral no worker: ${err.message}`);
    }

    return { processed, successful, failed };
  }
}
