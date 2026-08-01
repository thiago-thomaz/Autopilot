import { BusinessObjectiveStatus } from '@prisma/client';
import { BusinessObjectiveConfig, GoalGapAnalysis } from '../../types/business/business.types';

export class GoalGapEngine {
  public calculateGoalGap(
    objective: BusinessObjectiveConfig,
    currentDailyRunRate: number = 0
  ): GoalGapAnalysis {
    const targetValue = objective.targetValue || 0;
    const currentValue = objective.currentValue || 0;
    const gap = Math.max(0, targetValue - currentValue);

    const deadline = objective.deadline ? new Date(objective.deadline) : new Date(Date.now() + 30 * 86400000);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const requiredDailyRunRate = Number((gap / daysRemaining).toFixed(4));
    const onTrack = currentDailyRunRate >= requiredDailyRunRate;

    let status: BusinessObjectiveStatus = 'ON_TRACK';
    if (currentValue >= targetValue) {
      status = 'ACHIEVED';
    } else if (!onTrack) {
      status = currentDailyRunRate < requiredDailyRunRate * 0.7 ? 'BEHIND' : 'AT_RISK';
    }

    return {
      objectiveId: objective.id || 'obj_unknown',
      objectiveName: objective.name,
      targetValue,
      currentValue,
      gap: Number(gap.toFixed(4)),
      daysRemaining,
      requiredDailyRunRate,
      currentDailyRunRate: Number(currentDailyRunRate.toFixed(4)),
      status,
      onTrack
    };
  }
}
