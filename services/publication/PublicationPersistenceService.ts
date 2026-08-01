import { prisma } from '../../lib/prisma';
import { OmnichannelChannel, OmnichannelPublicationStatus } from '@prisma/client';
import { Logger } from '../../lib/logger';

export interface CreatePublicationRecordInput {
  contentPackageId: string;
  contentVersionId?: string;
  productId: string;
  opportunityId?: string;
  channel: OmnichannelChannel;
  platform?: string;
  accountId?: string;
  publicationType?: 'AUTOMATIC' | 'MANUAL';
  status?: OmnichannelPublicationStatus;
  publicationPayload?: any;
  trackingUrl?: string;
  scheduledAt?: Date;
  country?: string;
  language?: string;
  currency?: string;
  timezone?: string;
  campaignId?: string;
  idempotencyKey: string;
}

export class PublicationPersistenceService {
  /**
   * Salva uma nova publicação no banco de dados e cria a entrada na fila de execução via transação Prisma.
   */
  public static async createPublicationRecord(input: CreatePublicationRecordInput) {
    return await prisma.$transaction(async (tx) => {
      // 1. Criar o registro principal da publicação
      const record = await tx.publicationRecord.create({
        data: {
          contentPackageId: input.contentPackageId,
          contentVersionId: input.contentVersionId,
          productId: input.productId,
          opportunityId: input.opportunityId,
          channel: input.channel,
          platform: input.platform || input.channel.toLowerCase(),
          accountId: input.accountId,
          publicationType: input.publicationType || 'AUTOMATIC',
          status: input.status || 'QUEUED',
          publicationPayload: input.publicationPayload,
          trackingUrl: input.trackingUrl,
          scheduledAt: input.scheduledAt || new Date(),
          country: input.country || 'BR',
          language: input.language || 'pt-BR',
          currency: input.currency || 'BRL',
          timezone: input.timezone || 'America/Sao_Paulo',
          campaignId: input.campaignId,
          idempotencyKey: input.idempotencyKey,
        },
      });

      // 2. Criar o item correspondente na fila assíncrona
      await tx.publicationQueueItem.create({
        data: {
          publicationId: record.id,
          priority: 'NORMAL',
          scheduledAt: record.scheduledAt,
          status: 'PENDING',
        },
      });

      // 3. Registrar log de auditoria
      await tx.publicationAuditLog.create({
        data: {
          publicationId: record.id,
          event: 'PUBLICATION_CREATED',
          details: { channel: record.channel, country: record.country, idempotencyKey: record.idempotencyKey },
        },
      });

      Logger.info('PUBLICATION_ENGINE', 'RECORD_CREATED', `Publicação ${record.id} criada para o canal ${record.channel} (${record.country})`);

      return record;
    });
  }

  /**
   * Atualiza o resultado de uma publicação após a tentativa pelo worker.
   */
  public static async updatePublicationResult(
    publicationId: string,
    status: OmnichannelPublicationStatus,
    resultData: {
      externalPublicationId?: string;
      externalUrl?: string;
      errorMessage?: string;
      publicationPayload?: any;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      const updated = await tx.publicationRecord.update({
        where: { id: publicationId },
        data: {
          status,
          externalPublicationId: resultData.externalPublicationId,
          externalUrl: resultData.externalUrl,
          publicationPayload: resultData.publicationPayload || undefined,
          publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
          failedAt: status === 'FAILED' ? new Date() : undefined,
        },
      });

      await tx.publicationAuditLog.create({
        data: {
          publicationId,
          event: `STATUS_CHANGED_${status}`,
          details: { ...resultData },
        },
      });

      return updated;
    });
  }
}
