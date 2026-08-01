import {
  DecisionPayload,
  ActionPlanBlueprint,
  ActionStep,
  ActionType,
  RiskLevel,
} from '../../types/automation/automation.types';

export class ActionPlanner {
  planAction(decisionId: string, decision: DecisionPayload, riskLevel: RiskLevel): ActionPlanBlueprint {
    const steps: ActionStep[] = [];
    const rollbackPlan: ActionStep[] = [];

    switch (decision.decisionType) {
      case 'SCALE_WINNER':
      case 'INCREASE_DISTRIBUTION':
        steps.push({
          stepIndex: 1,
          actionType: ActionType.UPDATE_PRIORITY,
          platform: 'INTERNAL',
          entityType: decision.entityType,
          entityId: decision.entityId,
          payload: { priorityDelta: +1, scaleStep: 0.2 },
        });
        steps.push({
          stepIndex: 2,
          actionType: ActionType.CREATE_PUBLICATION_TASK,
          platform: 'INTERNAL',
          entityType: decision.entityType,
          entityId: decision.entityId,
          payload: { distributionBoost: 0.2 },
        });

        rollbackPlan.push({
          stepIndex: 1,
          actionType: ActionType.UPDATE_PRIORITY,
          platform: 'INTERNAL',
          entityType: decision.entityType,
          entityId: decision.entityId,
          payload: { priorityDelta: -1, scaleStep: -0.2 },
        });
        break;

      case 'STOP_UNPROFITABLE':
      case 'PAUSE':
        steps.push({
          stepIndex: 1,
          actionType: ActionType.PAUSE_CAMPAIGN,
          platform: 'INTERNAL',
          entityType: decision.entityType,
          entityId: decision.entityId,
          payload: { pauseReason: decision.reason },
        });

        rollbackPlan.push({
          stepIndex: 1,
          actionType: ActionType.RESUME_CAMPAIGN,
          platform: 'INTERNAL',
          entityType: decision.entityType,
          entityId: decision.entityId,
          payload: { resumeReason: 'Rollback requested' },
        });
        break;

      case 'RECREATE_CONTENT':
      case 'REFRESH_CONTENT':
        steps.push({
          stepIndex: 1,
          actionType: ActionType.CREATE_CONTENT_TASK,
          platform: 'INTERNAL',
          entityType: decision.entityType,
          entityId: decision.entityId,
          payload: { refreshAngle: true },
        });
        break;

      default:
        steps.push({
          stepIndex: 1,
          actionType: ActionType.UPDATE_PRIORITY,
          platform: 'INTERNAL',
          entityType: decision.entityType,
          entityId: decision.entityId,
          payload: { adjustment: decision.decisionType },
        });
        break;
    }

    const approvalRequired = riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.CRITICAL;

    return {
      decisionId,
      steps,
      estimatedCost: steps.length * 0.005,
      estimatedDuration: steps.length * 10,
      risk: riskLevel,
      rollbackPlan,
      approvalRequired,
    };
  }
}
