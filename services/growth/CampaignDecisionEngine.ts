export interface CampaignMetrics7Day {
  campaignId: string;
  currentBudget: number;
  rolling7DayROI: number;
  rolling7DayNetProfit: number;
  previous7DayROI: number;
  consecutiveProfitableDays: number;
  healthScore: number;
}

export interface TacticalDecision {
  campaignId: string;
  action: 'SCALE_GRADUAL' | 'HOLD' | 'REDUCE_BUDGET' | 'PAUSE' | 'EXIT' | 'TWEAK_VARIANT';
  scalePercentage?: number; // e.g. 10 or 20
  newBudget?: number;
  reason: string;
}

export class CampaignDecisionEngine {
  public evaluateTacticalDecision(metrics: CampaignMetrics7Day): TacticalDecision {
    const {
      campaignId,
      currentBudget,
      rolling7DayROI,
      rolling7DayNetProfit,
      previous7DayROI,
      consecutiveProfitableDays,
      healthScore
    } = metrics;

    // 1. Critical failure check: ROI negative or Health critical
    if (rolling7DayROI < -10 || healthScore < 30) {
      return {
        campaignId,
        action: 'PAUSE',
        reason: `Campaign paused due to negative ROI (${rolling7DayROI}%) or low health score (${healthScore})`
      };
    }

    // 2. Efficiency drop check (Rollback trigger)
    if (previous7DayROI > 15 && rolling7DayROI < 5) {
      const reduced = Math.max(0, currentBudget * 0.8);
      return {
        campaignId,
        action: 'REDUCE_BUDGET',
        scalePercentage: -20,
        newBudget: Number(reduced.toFixed(4)),
        reason: `Efficiency drop detected (ROI fell from ${previous7DayROI}% to ${rolling7DayROI}%). Triggering -20% rollback.`
      };
    }

    // 3. Incremental scaling: +10% or +20% with 7-day rolling check
    if (consecutiveProfitableDays >= 7 && rolling7DayROI >= 25 && healthScore >= 80) {
      const scalePercent = rolling7DayROI >= 50 ? 20 : 10;
      const scaledBudget = currentBudget * (1 + scalePercent / 100);
      return {
        campaignId,
        action: 'SCALE_GRADUAL',
        scalePercentage: scalePercent,
        newBudget: Number(scaledBudget.toFixed(4)),
        reason: `7-day rolling performance verified (${consecutiveProfitableDays} profitable days, ROI: ${rolling7DayROI}%). Scaling +${scalePercent}%.`
      };
    }

    // 4. Variant tweaking needed if health score is warning (40-60)
    if (healthScore >= 40 && healthScore < 60) {
      return {
        campaignId,
        action: 'TWEAK_VARIANT',
        reason: `Health score warning (${healthScore}). Recommending variant tweak.`
      };
    }

    return {
      campaignId,
      action: 'HOLD',
      reason: 'Campaign operating within normal parameters.'
    };
  }
}
