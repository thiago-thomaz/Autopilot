import { GrowthTaskPriority, GrowthTaskType } from '@prisma/client';
import { GrowthTaskConfig } from '../../types/growth/campaign.types';

export class CampaignScheduler {
  public createScheduledTask(
    campaignId: string,
    type: GrowthTaskType,
    scheduledAt: Date = new Date(),
    priority: GrowthTaskPriority = 'P2',
    dependencies: string[] = []
  ): GrowthTaskConfig {
    return {
      campaignId,
      type,
      priority,
      status: 'PENDING',
      scheduledAt,
      dependencies
    };
  }

  public sortTasksByExecutionOrder(tasks: GrowthTaskConfig[]): GrowthTaskConfig[] {
    const priorityWeight: Record<GrowthTaskPriority, number> = {
      P0: 0,
      P1: 1,
      P2: 2,
      P3: 3
    };

    return [...tasks].sort((a, b) => {
      const pDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (pDiff !== 0) return pDiff;

      const dateA = new Date(a.scheduledAt || 0).getTime();
      const dateB = new Date(b.scheduledAt || 0).getTime();
      return dateA - dateB;
    });
  }
}
