import { prisma } from '../../lib/prisma';
import { Logger } from '../../lib/logger';

export class DiscoverySchedulerService {
  private static MAX_CONCURRENT_JOBS = parseInt(process.env.MAX_CONCURRENT_DISCOVERY_JOBS || '1', 10);

  /**
   * Verifica se há capacidade de concorrência disponível.
   */
  public static async canExecuteNewJob(): Promise<boolean> {
    try {
      const runningJobs = await prisma.discoveryJob.count({
        where: { status: 'RUNNING' },
      });
      return runningJobs < this.MAX_CONCURRENT_JOBS;
    } catch {
      return true;
    }
  }

  /**
   * Adiciona um item para execução agendada na fila DiscoveryQueue.
   */
  public static async enqueueSearch(platform: string, query: string, accountId?: string, category?: string, priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' = 'NORMAL') {
    return await prisma.discoveryQueue.create({
      data: {
        platform,
        accountId,
        query,
        category,
        priority,
        status: 'PENDING',
      },
    });
  }
}
