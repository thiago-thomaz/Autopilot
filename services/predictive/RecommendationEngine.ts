import { RecommendationItem, PredictiveOpportunity } from '../../types/predictive/predictive.types';

export class RecommendationEngine {
  public generateRecommendations(opportunities: PredictiveOpportunity[]): RecommendationItem[] {
    return opportunities.map((opp, idx) => {
      let type: RecommendationItem['type'] = 'PRODUCT';
      if (opp.expectedROI > 150) type = 'OFFER';
      else if (opp.cvrProbability > 0.035) type = 'CHANNEL';

      return {
        id: `rec-${Date.now()}-${idx}`,
        type,
        entityId: opp.productId,
        score: opp.opportunityScore,
        confidence: opp.confidenceScore,
        expectedImpact: {
          profitDelta: opp.expectedProfit,
          roiDelta: opp.expectedROI
        },
        risk: opp.riskScore,
        reason: `Predictive model identified high potential (Score: ${opp.opportunityScore}, CVR: ${(opp.cvrProbability * 100).toFixed(1)}%).`,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
    });
  }
}
