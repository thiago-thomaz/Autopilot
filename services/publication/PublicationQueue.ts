import { prisma } from '../../lib/prisma';

export class PublicationQueue {
  /**
   * Enfileira uma publicação para execução assíncrona.
   */
  public static async enqueue(publicationId: string, scheduledAt?: Date) {
    return await prisma.publicationQueueItem.create({
      data: {
        publicationId,
        priority: 'NORMAL',
        scheduledAt: scheduledAt || new Date(),
        status: 'PENDING',
      },
    });
  }
}
