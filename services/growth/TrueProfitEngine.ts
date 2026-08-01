import { TrueProfitBreakdown } from '../../types/growth/growth.types';

export interface RawCostData {
  commission: number;
  refunds?: number;
  reversals?: number;
  aiCosts?: number;
  contentCosts?: number;
  localizationCosts?: number;
  publicationCosts?: number;
  messagingCosts?: number;
  infrastructureCosts?: number;
  currency?: string;
}

export class TrueProfitEngine {
  /**
   * Calculates Real Net Profit considering all operational, AI, content, and reversal costs.
   * Net Profit = Commission - Refunds - Reversals - AI Costs - Content Costs - Localization Costs - Publication Costs - Messaging Costs - Infrastructure Costs
   */
  public calculateNetProfit(data: RawCostData): TrueProfitBreakdown {
    const grossCommission = Number(data.commission) || 0;
    const refunds = Number(data.refunds) || 0;
    const reversals = Number(data.reversals) || 0;

    const aiCosts = Number(data.aiCosts) || 0;
    const contentCosts = Number(data.contentCosts) || 0;
    const localizationCosts = Number(data.localizationCosts) || 0;
    const publicationCosts = Number(data.publicationCosts) || 0;
    const messagingCosts = Number(data.messagingCosts) || 0;
    const infrastructureCosts = Number(data.infrastructureCosts) || 0;

    const totalCosts =
      refunds +
      reversals +
      aiCosts +
      contentCosts +
      localizationCosts +
      publicationCosts +
      messagingCosts +
      infrastructureCosts;

    const netProfit = grossCommission - totalCosts;
    const roi = totalCosts > 0 ? (netProfit / totalCosts) * 100 : netProfit > 0 ? 100 : 0;

    return {
      grossCommission: Number(grossCommission.toFixed(4)),
      refunds: Number(refunds.toFixed(4)),
      reversals: Number(reversals.toFixed(4)),
      aiCosts: Number(aiCosts.toFixed(4)),
      contentCosts: Number(contentCosts.toFixed(4)),
      localizationCosts: Number(localizationCosts.toFixed(4)),
      publicationCosts: Number(publicationCosts.toFixed(4)),
      messagingCosts: Number(messagingCosts.toFixed(4)),
      infrastructureCosts: Number(infrastructureCosts.toFixed(4)),
      totalCosts: Number(totalCosts.toFixed(4)),
      netProfit: Number(netProfit.toFixed(4)),
      roi: Number(roi.toFixed(2)),
      currency: data.currency || 'USD'
    };
  }

  public isProfitable(breakdown: TrueProfitBreakdown, minROIThreshold: number = 0): boolean {
    return breakdown.netProfit > 0 && breakdown.roi >= minROIThreshold;
  }
}
