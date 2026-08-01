import { GrowthTaskConfig } from '../../types/growth/campaign.types';

export interface ExecutionResult {
  taskId: string;
  success: boolean;
  error?: string;
  completedAt: Date;
}

export class GrowthWorkflowEngine {
  private queue: GrowthTaskConfig[] = [];

  public enqueueTasks(tasks: GrowthTaskConfig[]): void {
    this.queue.push(...tasks);
  }

  public getNextPendingTask(): GrowthTaskConfig | null {
    const idx = this.queue.findIndex((t) => t.status === 'PENDING' || t.status === 'QUEUED');
    if (idx === -1) return null;
    return this.queue[idx];
  }

  public executeTask(task: GrowthTaskConfig): ExecutionResult {
    task.status = 'RUNNING';
    try {
      // Execute dummy workflow logic step
      task.status = 'COMPLETED';
      task.completedAt = new Date();
      return {
        taskId: task.id || 'task_unknown',
        success: true,
        completedAt: new Date()
      };
    } catch (err: any) {
      task.status = 'FAILED';
      task.error = err.message || 'Unknown task error';
      return {
        taskId: task.id || 'task_unknown',
        success: false,
        error: task.error,
        completedAt: new Date()
      };
    }
  }
}
