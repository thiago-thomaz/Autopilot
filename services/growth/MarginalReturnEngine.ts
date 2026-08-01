import { MarginalReturnResult } from '../../types/growth/growth.types';

export interface CampaignPerformanceStats {
  campaignId: string;
  currentBudget: number;
  currentProfit: number;
  historicalProfits: number[];
  historicalBudgets: number[];
  saturationFactor?: number;
}

export class MarginalReturnEngine {
  /**
   * Computes the marginal return ratio: ΔProfit / ΔBudget for a proposed budget increase.
   */
  public evaluateMarginalReturn(
    stats: CampaignPerformanceStats,
    proposedBudgetDelta: number
  ): MarginalReturnResult {
    const { campaignId, currentBudget, currentProfit, saturationFactor = 0.1 } = stats;

    if (proposedBudgetDelta <= 0) {
      return {
        campaignId,
        currentBudget,
        proposedBudgetDelta,
        expectedProfitDelta: 0,
        marginalReturnRatio: 0,
        saturationLevel: saturationFactor,
        recommendation: 'HOLD'
      };
    }

    // Diminishing returns curve: ProfitDelta = BudgetDelta * (Baseline Return) * (1 - Saturation)
    const baseReturnMultiplier = currentBudget > 0 ? (currentProfit / currentBudget) : 1.5;
    const saturationDampener = Math.max(0.05, 1 - saturationFactor);
    const expectedProfitDelta = proposedBudgetDelta * baseReturnMultiplier * saturationDampener;
    const marginalReturnRatio = expectedProfitDelta / proposedBudgetDelta;

    let recommendation: 'SCALE' | 'HOLD' | 'REDUCE' | 'PAUSE' = 'HOLD';
    if (marginalReturnRatio >= 1.2 && saturationFactor < 0.7) {
      recommendation = 'SCALE';
    } else if (marginalReturnRatio < 0.8 || saturationFactor >= 0.85) {
      recommendation = 'REDUCE';
    }

    return {
      campaignId,
      currentBudget,
      proposedBudgetDelta,
      expectedProfitDelta: Number(expectedProfitDelta.toFixed(4)),
      marginalReturnRatio: Number(marginalReturnRatio.toFixed(4)),
      saturationLevel: Number(saturationFactor.toFixed(4)),
      recommendation
    };
  }
}
