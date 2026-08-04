import { PublicationWorker } from './PublicationWorker';

export class PublishQueueService {
  /**
   * Processa a fila de publicação pendente.
   */
  public static async processPendingQueue(limit = 20) {
    const worker = new PublicationWorker(`n8n_worker_${Date.now()}`);
    const result = await worker.processPendingQueue(limit);
    return result;
  }
}
