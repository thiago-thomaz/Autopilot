import { PredictiveOpportunity } from '../../types/predictive/predictive.types';

export interface PortfolioAllocation {
  opportunities: PredictiveOpportunity[];
  totalExpectedProfit: number;
  portfolioRiskScore: number;
  diversificationScore: number; // 0 to 100
}

export class OpportunityPortfolioEngine {
  public optimizePortfolio(
    opportunities: PredictiveOpportunity[],
    maxItems: number = 10
  ): PortfolioAllocation {
    const sorted = [...opportunities].sort((a, b) => b.opportunityScore - a.opportunityScore);
    const selected = sorted.slice(0, maxItems);

    const categories = new Set(selected.map(s => s.category));
    const diversificationScore = Math.min(100, (categories.size / Math.max(1, selected.length)) * 100);

    const totalExpectedProfit = selected.reduce((sum, item) => sum + item.expectedProfit, 0);
    const avgRisk = selected.reduce((sum, item) => sum + item.riskScore, 0) / (selected.length || 1);

    return {
      opportunities: selected,
      totalExpectedProfit: Number(totalExpectedProfit.toFixed(2)),
      portfolioRiskScore: Number(avgRisk.toFixed(1)),
      diversificationScore: Number(diversificationScore.toFixed(1))
    };
  }
}
