import { OpportunityEvaluationItem } from '../../types/intelligence/intelligence.types';

export class OpportunityDetectionEngine {
  public detectOpportunity(
    title: string,
    domain: string,
    expectedNetProfit: number,
    cvr: number,
    epc: number,
    riskScore: number = 20
  ): OpportunityEvaluationItem {
    const opportunityScore = Number(
      Math.min(100, Math.max(0, expectedNetProfit * 0.05 + cvr * 500 + epc * 2 - riskScore * 0.5)).toFixed(2)
    );
    const priorityScore = Number((opportunityScore / Math.max(1, riskScore)).toFixed(2));

    return {
      title,
      domain,
      expectedNetProfit: Number(expectedNetProfit.toFixed(4)),
      cvr: Number(cvr.toFixed(4)),
      epc: Number(epc.toFixed(4)),
      riskScore: Number(riskScore.toFixed(2)),
      priorityScore,
      opportunityScore
    };
  }
}
