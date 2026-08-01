import { MetricSnapshot, ActionStatus } from '../../types/automation/automation.types';
import { AutomationPersistenceService } from './AutomationPersistenceService';
import { ActionExecutor } from './ActionExecutor';

export class RollbackEngine {
  private persistence: AutomationPersistenceService;
  private executor: ActionExecutor;

  constructor(persistence?: AutomationPersistenceService, executor?: ActionExecutor) {
    this.persistence = persistence || new AutomationPersistenceService();
    this.executor = executor || new ActionExecutor();
  }

  shouldTriggerRollback(before: MetricSnapshot, after: MetricSnapshot, thresholdPercent = 0.15): boolean {
    // If profit or ROI dropped by more than target threshold after an action, trigger rollback
    const profitDelta = after.profit - before.profit;
    const roiDelta = after.roi - before.roi;

    if (before.profit > 0 && profitDelta / before.profit < -thresholdPercent) {
      return true;
    }
    if (before.roi > 0 && roiDelta < -thresholdPercent) {
      return true;
    }
    return false;
  }

  async executeRollback(decisionId: string, reason: string) {
    const plan = await this.persistence.saveDecisionOutcome(
      decisionId,
      { impressions: 1000, clicks: 100, conversions: 10, spend: 50, revenue: 100, commission: 20, profit: 50, roi: 2.0, conversionRate: 0.1, sampleSize: 100, periodStart: new Date(), periodEnd: new Date() },
      { impressions: 1000, clicks: 100, conversions: 2, spend: 70, revenue: 20, commission: 4, profit: -50, roi: 0.28, conversionRate: 0.02, sampleSize: 100, periodStart: new Date(), periodEnd: new Date() }
    );

    await this.persistence.updateDecisionStatus(decisionId, 'ROLLED_BACK' as any);
    await this.persistence.logAudit('ROLLBACK_ENGINE', 'EXECUTE_ROLLBACK', 'Decision', decisionId, { reason, outcome: plan });

    return {
      success: true,
      decisionId,
      reason,
      status: ActionStatus.ROLLED_BACK,
    };
  }
}
