import { prisma } from '../../lib/prisma';
import { Logger } from '../../lib/logger';
import { AutomationJobStatus } from '@prisma/client';

export class DiscoveryJobService {
  /**
   * Cria um registro de busca e de trabalho assíncrono para o engine de descoberta.
   */
  public static async createDiscoveryJob(platform: string, query: string, accountId?: string, filters?: any) {
    try {
      const search = await prisma.discoverySearch.create({
        data: {
          platform,
          accountId,
          query,
          filters: filters ? (filters as any) : undefined,
          status: 'RUNNING',
        },
      });

      const job = await prisma.discoveryJob.create({
        data: {
          platform,
          accountId,
          searchId: search.id,
          status: 'RUNNING',
          startedAt: new Date(),
        },
      });

      return { search, job };
    } catch (err: any) {
      Logger.error('DISCOVERY_JOB', 'CREATE_FAILED', `Falha ao registrar DiscoveryJob: ${err.message}`);
      return null;
    }
  }

  /**
   * Finaliza o job atualizando estatísticas de importação, alteração e rejeição.
   */
  public static async completeDiscoveryJob(
    jobId: string,
    searchId: string,
    stats: { found: number; imported: number; updated: number; rejected: number; executionTimeMs: number },
    status: AutomationJobStatus = 'COMPLETED',
    errorMessage?: string
  ) {
    try {
      if (jobId) {
        await prisma.discoveryJob.update({
          where: { id: jobId },
          data: {
            status,
            finishedAt: new Date(),
            itemsFound: stats.found,
            itemsImported: stats.imported,
            itemsUpdated: stats.updated,
            itemsRejected: stats.rejected,
            errorMessage,
          },
        });
      }

      if (searchId) {
        await prisma.discoverySearch.update({
          where: { id: searchId },
          data: {
            status: status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
            resultsCount: stats.found,
            importedCount: stats.imported,
            updatedCount: stats.updated,
            rejectedCount: stats.rejected,
            executionTimeMs: stats.executionTimeMs,
            errorMessage,
          },
        });
      }
    } catch (err: any) {
      Logger.error('DISCOVERY_JOB', 'UPDATE_FAILED', `Falha ao finalizar DiscoveryJob: ${err.message}`);
    }
  }

  public static async listJobs(limit = 20) {
    try {
      return await prisma.discoveryJob.findMany({
        orderBy: { startedAt: 'desc' },
        take: limit,
      });
    } catch {
      return [];
    }
  }
}
