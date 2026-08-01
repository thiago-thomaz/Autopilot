import { RewardSignal } from '../../types/learning/learning.types';

export class RewardEngine {
  /**
   * Calculates reinforcement learning signal based on Net Profit and ROI variance
   * Normalizes value strictly between -1.0 and +1.0
   */
  public calculateReward(
    decisionId: string,
    entityId: string,
    entityType: string,
    actualNetProfit: number,
    expectedNetProfit: number,
    actualROI: number,
    expectedROI: number
  ): RewardSignal {
    const profitVariance = actualNetProfit - expectedNetProfit;
    const roiVariance = actualROI - expectedROI;

    let rewardValue = 0;

    if (expectedNetProfit !== 0) {
      const profitRatio = profitVariance / Math.abs(expectedNetProfit);
      rewardValue += profitRatio * 0.7; // 70% weight on Net Profit
    } else {
      rewardValue += profitVariance > 0 ? 0.5 : (profitVariance < 0 ? -0.5 : 0);
    }

    if (expectedROI !== 0) {
      const roiRatio = roiVariance / Math.abs(expectedROI);
      rewardValue += roiRatio * 0.3; // 30% weight on ROI
    } else {
      rewardValue += roiVariance > 0 ? 0.3 : (roiVariance < 0 ? -0.3 : 0);
    }

    // Clamp reward between -1.0 and +1.0
    rewardValue = Math.max(-1.0, Math.min(1.0, Number(rewardValue.toFixed(4))));
    const isPositive = rewardValue >= 0;

    return {
      decisionId,
      entityId,
      entityType,
      actualROI: Number(actualROI.toFixed(4)),
      expectedROI: Number(expectedROI.toFixed(4)),
      actualNetProfit: Number(actualNetProfit.toFixed(4)),
      expectedNetProfit: Number(expectedNetProfit.toFixed(4)),
      rewardValue,
      isPositive,
      variance: Number(profitVariance.toFixed(4)),
      calculatedAt: new Date().toISOString()
    };
  }
}
