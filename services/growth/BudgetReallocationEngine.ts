export interface CampaignPerformanceForReallocation {
  campaignId: string;
  currentBudget: number;
  roi: number;
  netProfit: number;
  status: string;
}

export interface ReallocationInstruction {
  sourceCampaignId: string;
  targetCampaignId: string;
  transferredAmount: number;
  reason: string;
}

export class BudgetReallocationEngine {
  /**
   * Reallocates budget from underperforming/paused campaigns to high-ROI active campaigns.
   */
  public evaluateReallocation(
    campaigns: CampaignPerformanceForReallocation[]
  ): ReallocationInstruction[] {
    const underperforming = campaigns.filter(
      (c) => c.status === 'PAUSED' || (c.status === 'RUNNING' && (c.roi < 0 || c.netProfit < 0))
    );

    const highPerformers = campaigns.filter(
      (c) => c.status === 'RUNNING' && c.roi >= 20 && c.netProfit > 0
    ).sort((a, b) => b.roi - a.roi);

    if (underperforming.length === 0 || highPerformers.length === 0) {
      return [];
    }

    const instructions: ReallocationInstruction[] = [];

    for (const source of underperforming) {
      if (source.currentBudget <= 0) continue;
      const target = highPerformers[0]; // Transfer to top performer
      const transferAmount = Number(source.currentBudget.toFixed(4));

      instructions.push({
        sourceCampaignId: source.campaignId,
        targetCampaignId: target.campaignId,
        transferredAmount: transferAmount,
        reason: `Reallocating funds from underperforming campaign (${source.campaignId}, ROI: ${source.roi}%) to top performer (${target.campaignId}, ROI: ${target.roi}%)`
      });

      source.currentBudget = 0;
      target.currentBudget += transferAmount;
    }

    return instructions;
  }
}
