import { CampaignStrategy } from '@prisma/client';
import { CampaignConfig, CampaignProposalConfig } from '../../types/growth/campaign.types';

export interface OpportunitySignal {
  productId: string;
  productTitle: string;
  opportunityScore: number;
  expectedProfit: number;
  expectedROI: number;
  recommendedChannel: string;
  recommendedLanguage: string;
  recommendedMarket: string;
  affiliateProgramId?: string;
  offerId?: string;
}

export class CampaignPlanner {
  public planCampaignFromOpportunity(
    opportunity: OpportunitySignal,
    budgetAllocated: number,
    strategy: CampaignStrategy = 'HARVEST'
  ): CampaignConfig {
    const campaignName = `AutoCampaign_${opportunity.recommendedMarket}_${opportunity.productId.slice(0, 8)}_${strategy}`;

    return {
      name: campaignName,
      description: `Autonomous campaign targeting ${opportunity.productTitle} in ${opportunity.recommendedMarket} via ${opportunity.recommendedChannel}`,
      strategy,
      productId: opportunity.productId,
      offerId: opportunity.offerId,
      affiliateProgramId: opportunity.affiliateProgramId,
      marketId: opportunity.recommendedMarket,
      language: opportunity.recommendedLanguage || 'pt-BR',
      channel: opportunity.recommendedChannel || 'INSTAGRAM',
      budget: budgetAllocated,
      expectedRevenue: opportunity.expectedProfit * 1.5,
      expectedProfit: opportunity.expectedProfit,
      expectedROI: opportunity.expectedROI,
      confidence: Math.min(0.95, opportunity.opportunityScore / 100),
      risk: 0.15
    };
  }

  public createGrowthPlan(
    proposals: CampaignProposalConfig[],
    totalBudget: number
  ) {
    const approvedProposals = proposals.filter((p) => p.approved || p.risk < 0.25);
    const expectedProfitTotal = approvedProposals.reduce((sum, p) => sum + p.expectedProfit, 0);

    return {
      period: 'WEEKLY' as const,
      proposals: approvedProposals,
      totalBudget,
      expectedProfitTotal,
      riskLevel: approvedProposals.length > 0 ? 0.15 : 0.05
    };
  }
}
