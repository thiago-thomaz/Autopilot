import { DecisionPayload, ActionPlanStep } from '../../types/intelligence/decision.types';

export interface GeneratedActionPlan {
  id: string;
  decisionId: string;
  steps: ActionPlanStep[];
  estimatedCost: number;
  estimatedDuration: number; // seconds
  rollbackPlan: ActionPlanStep[];
  status: 'PLANNED' | 'EXECUTING' | 'COMPLETED' | 'ROLLED_BACK';
}

export class ActionPlanner {
  public planAction(decision: DecisionPayload): GeneratedActionPlan {
    const steps: ActionPlanStep[] = [
      {
        stepOrder: 1,
        actionName: `Execute ${decision.actionType} on ${decision.entityType}`,
        targetModule: 'M11',
        payload: { entityId: decision.entityId, actionType: decision.actionType },
        costEstimate: 0.05
      }
    ];

    const rollbackPlan: ActionPlanStep[] = steps.map((s) => ({
      stepOrder: s.stepOrder,
      actionName: `Rollback ${decision.actionType}`,
      targetModule: 'M11',
      payload: { entityId: decision.entityId },
      costEstimate: 0.0
    }));

    return {
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      decisionId: decision.id || 'dec_unknown',
      steps,
      estimatedCost: 0.05,
      estimatedDuration: 60,
      rollbackPlan,
      status: 'PLANNED'
    };
  }
}
