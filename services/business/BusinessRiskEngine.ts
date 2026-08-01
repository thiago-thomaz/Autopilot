import { BusinessRiskCategory } from '@prisma/client';

export interface BusinessRiskItem {
  id?: string;
  category: BusinessRiskCategory;
  description: string;
  probability: number; // 0.0 to 1.0
  impact: number; // 0.0 to 1.0
  score: number; // probability * impact * 100
  mitigationPlan?: string;
  status: string;
}

export class BusinessRiskEngine {
  public evaluateRisk(category: BusinessRiskCategory, description: string, probability: number, impact: number): BusinessRiskItem {
    const score = Number((probability * impact * 100).toFixed(2));
    let mitigationPlan = 'Monitor metrics and maintain standard guardrails.';

    if (score >= 60) {
      mitigationPlan = 'HIGH RISK: Mandatory human approval, cash reserve lock checks, and diversification enforcement.';
    } else if (score >= 30) {
      mitigationPlan = 'MEDIUM RISK: Increase monitoring frequency and enable automated rollback triggers.';
    }

    return {
      category,
      description,
      probability: Number(probability.toFixed(2)),
      impact: Number(impact.toFixed(2)),
      score,
      mitigationPlan,
      status: 'ACTIVE'
    };
  }
}
