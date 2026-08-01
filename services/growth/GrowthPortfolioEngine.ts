import { CampaignStrategy } from '@prisma/client';

export interface CampaignPortfolioItem {
  campaignId: string;
  strategy: CampaignStrategy;
  allocatedBudget: number;
  expectedProfit: number;
}

export interface PortfolioBalanceReport {
  currentAllocation: Record<CampaignStrategy, number>;
  targetAllocation: Record<CampaignStrategy, number>;
  variance: Record<CampaignStrategy, number>;
  isBalanced: boolean;
}

export class GrowthPortfolioEngine {
  public evaluateBalance(
    items: CampaignPortfolioItem[],
    target: Record<CampaignStrategy, number>
  ): PortfolioBalanceReport {
    const total = items.reduce((sum, i) => sum + i.allocatedBudget, 0);

    const current: Record<CampaignStrategy, number> = {
      HARVEST: 0,
      EXPANSION: 0,
      EXPLORATION: 0,
      DEFENSE: 0,
      RECOVERY: 0,
      DIVERSIFICATION: 0,
      EFFICIENCY: 0
    };

    if (total > 0) {
      items.forEach((i) => {
        current[i.strategy] = (current[i.strategy] || 0) + (i.allocatedBudget / total) * 100;
      });
    }

    const variance: Record<CampaignStrategy, number> = {
      HARVEST: Number(((current.HARVEST || 0) - (target.HARVEST || 0)).toFixed(2)),
      EXPANSION: Number(((current.EXPANSION || 0) - (target.EXPANSION || 0)).toFixed(2)),
      EXPLORATION: Number(((current.EXPLORATION || 0) - (target.EXPLORATION || 0)).toFixed(2)),
      DEFENSE: Number(((current.DEFENSE || 0) - (target.DEFENSE || 0)).toFixed(2)),
      RECOVERY: 0,
      DIVERSIFICATION: 0,
      EFFICIENCY: 0
    };

    const maxVariance = Math.max(...Object.values(variance).map(Math.abs));
    const isBalanced = maxVariance <= 10;

    return {
      currentAllocation: {
        HARVEST: Number((current.HARVEST || 0).toFixed(2)),
        EXPANSION: Number((current.EXPANSION || 0).toFixed(2)),
        EXPLORATION: Number((current.EXPLORATION || 0).toFixed(2)),
        DEFENSE: Number((current.DEFENSE || 0).toFixed(2)),
        RECOVERY: 0,
        DIVERSIFICATION: 0,
        EFFICIENCY: 0
      },
      targetAllocation: target,
      variance,
      isBalanced
    };
  }
}
