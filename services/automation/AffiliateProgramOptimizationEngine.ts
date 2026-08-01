import { DecisionPayload, DecisionType } from '../../types/automation/automation.types';

export class AffiliateProgramOptimizationEngine {
  evaluateProgram(programId: string, currentCommissionRate: number, alternativeRate: number): DecisionPayload | null {
    if (alternativeRate > currentCommissionRate * 1.15) {
      return {
        scope: 'PRODUCT',
        entityType: 'AffiliateProgram',
        entityId: programId,
        decisionType: DecisionType.CHANGE_OFFER,
        reason: `Higher commission program identified (${(alternativeRate * 100).toFixed(1)}% vs ${(currentCommissionRate * 100).toFixed(1)}%).`,
        confidence: 0.92,
        riskScore: 35,
        priority: 1,
      };
    }
    return null;
  }
}
