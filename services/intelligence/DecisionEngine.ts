import { DecisionHierarchyLevel, DecisionActionType, DecisionStatusType } from '@prisma/client';
import { DecisionPayload } from '../../types/intelligence/decision.types';

export class DecisionEngine {
  public createDecision(
    title: string,
    level: DecisionHierarchyLevel,
    actionType: DecisionActionType,
    entityType: string,
    entityId: string,
    reason: string,
    expectedProfitImpact: number,
    expectedRiskScore: number,
    priorityScore: number,
    confidenceScore: number = 0.85
  ): DecisionPayload {
    const requiresHumanApproval = level === 'LEVEL_3_STRATEGIC' || expectedRiskScore >= 60 || expectedProfitImpact >= 1000;
    const idempotencyKey = `dec_${entityType}_${entityId}_${actionType}_${Date.now()}`;

    return {
      title,
      level,
      actionType,
      entityType,
      entityId,
      reason,
      confidenceScore: Number(confidenceScore.toFixed(2)),
      expectedProfitImpact: Number(expectedProfitImpact.toFixed(4)),
      expectedRiskScore: Number(expectedRiskScore.toFixed(2)),
      priorityScore: Number(priorityScore.toFixed(2)),
      idempotencyKey,
      status: requiresHumanApproval ? 'PENDING_APPROVAL' : 'APPROVED',
      requiresHumanApproval
    };
  }
}
