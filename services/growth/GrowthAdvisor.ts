export interface GrowthAdvisorRecommendation {
  type: 'BUDGET_REALLOCATION' | 'CAMPAIGN_SCALE' | 'CONTENT_REFRESH' | 'NEW_MARKET';
  headline: string;
  description: string;
  expectedProfitImpact: number;
  confidence: number;
  priority: 'P0' | 'P1' | 'P2';
}

export class GrowthAdvisor {
  public generateRecommendations(
    activeCampaignsCount: number,
    totalProfit: number,
    averageROI: number
  ): GrowthAdvisorRecommendation[] {
    const recommendations: GrowthAdvisorRecommendation[] = [];

    if (averageROI >= 30 && activeCampaignsCount < 10) {
      recommendations.push({
        type: 'CAMPAIGN_SCALE',
        headline: 'Scale Active Top Performers',
        description: `Average ROI is high (${averageROI.toFixed(1)}%). Consider expanding budget allocation to high-converting products.`,
        expectedProfitImpact: totalProfit * 0.25,
        confidence: 0.9,
        priority: 'P0'
      });
    }

    if (activeCampaignsCount > 0) {
      recommendations.push({
        type: 'CONTENT_REFRESH',
        headline: 'A/B Test Creative Hooks',
        description: 'Refresh copy hooks and visual briefs for campaigns active over 14 days to prevent ad fatigue.',
        expectedProfitImpact: totalProfit * 0.1,
        confidence: 0.8,
        priority: 'P1'
      });
    }

    return recommendations;
  }
}
