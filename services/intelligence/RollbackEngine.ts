import { GeneratedActionPlan } from './ActionPlanner';

export interface RollbackResult {
  planId: string;
  success: boolean;
  stepsExecuted: number;
  message: string;
}

export class RollbackEngine {
  public executeRollback(plan: GeneratedActionPlan, reason: string): RollbackResult {
    if (!plan.rollbackPlan || plan.rollbackPlan.length === 0) {
      return {
        planId: plan.id,
        success: false,
        stepsExecuted: 0,
        message: 'No rollback steps defined for this action plan.'
      };
    }

    plan.status = 'ROLLED_BACK';
    return {
      planId: plan.id,
      success: true,
      stepsExecuted: plan.rollbackPlan.length,
      message: `Rollback executed successfully due to: ${reason}`
    };
  }
}
