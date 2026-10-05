import { PublicationWorker } from './PublicationWorker';

export class PublishQueueService {
  /**
   * Processa a fila de publicação pendente nativamente.
   */
  public static async processPendingQueue(limit = 20) {
    const worker = new PublicationWorker(`native_worker_${Date.now()}`);
    const result = await worker.processPendingQueue(limit);
    return result;
  }
}
