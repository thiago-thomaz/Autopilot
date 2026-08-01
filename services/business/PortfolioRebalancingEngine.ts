import { DiversificationAnalysis } from '../../types/business/business.types';

export interface RebalanceRecommendation {
  action: 'EXPAND_MARKET' | 'EXPAND_CHANNEL' | 'DIVERSIFY_PRODUCTS' | 'ADD_AFFILIATE_PROGRAM';
  targetDomain: string;
  rationale: string;
  suggestedCapitalShare: number; // % of budget to reallocate
}

export class PortfolioRebalancingEngine {
  public generateRebalancePlan(analysis: DiversificationAnalysis): RebalanceRecommendation[] {
    if (!analysis.hasConcentrationRisk) return [];

    const recommendations: RebalanceRecommendation[] = [];

    if (analysis.highestRiskFactor === 'PRODUCT_CONCENTRATION') {
      recommendations.push({
        action: 'DIVERSIFY_PRODUCTS',
        targetDomain: 'Top Category Complementary Products',
        rationale: `Top product accounts for ${analysis.productConcentration}% of profits. Launching campaigns for 3 complementary products to lower single-item dependence.`,
        suggestedCapitalShare: 20
      });
    }

    if (analysis.highestRiskFactor === 'MARKET_CONCENTRATION') {
      recommendations.push({
        action: 'EXPAND_MARKET',
        targetDomain: 'Secondary High-Affinity Markets',
        rationale: `Primary market accounts for ${analysis.marketConcentration}% of profits. Allocating 15% of budget to international market localization.`,
        suggestedCapitalShare: 15
      });
    }

    if (analysis.highestRiskFactor === 'CHANNEL_CONCENTRATION') {
      recommendations.push({
        action: 'EXPAND_CHANNEL',
        targetDomain: 'Alternative Distribution Channels',
        rationale: `Top channel represents ${analysis.channelConcentration}% of distribution. Cross-posting content to secondary channels.`,
        suggestedCapitalShare: 10
      });
    }

    return recommendations;
  }
}
