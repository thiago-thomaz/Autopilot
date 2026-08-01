import { PublicationPlanner } from './PublicationPlanner';
import { PublicationWorker } from './PublicationWorker';
import { PublicationPlanRequest } from '../../types/publication/publication.types';

export class OmnichannelOrchestrator {
  /**
   * Executa o fluxo completo de publicação: planeja as publicações nos canais/países e aciona o worker para envio.
   */
  public static async executeDistributionFlow(request: PublicationPlanRequest) {
    // 1. Planejamento das publicações por canal/país
    const plan = await PublicationPlanner.createPlan(request);

    // 2. Processar a fila imediatamente via Worker
    const worker = new PublicationWorker(`orchestrator_worker_${Date.now()}`);
    const workerResult = await worker.processPendingQueue(50);

    return {
      plan,
      workerResult,
    };
  }
}
