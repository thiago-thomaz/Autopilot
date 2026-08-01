import { ExecutiveDREStatement, OperatingCostsBreakdown } from '../../types/business/financial.types';

export interface RawExecutiveFinancialData {
  commissionRevenue: number;
  refunds?: number;
  reversals?: number;
  aiCosts?: number;
  apiCosts?: number;
  contentCosts?: number;
  translationCosts?: number;
  publicationCosts?: number;
  messagingCosts?: number;
  infrastructureCosts?: number;
  toolsCosts?: number;
  otherCosts?: number;
  currency?: string;
  date?: Date | string;
}

export class TrueBusinessProfitEngine {
  /**
   * Generates the Executive DRE (P&L Statement) subtracting all operating, AI, infra, and reversal costs.
   * Net Profit = Commission Revenue - Refunds - Reversals - Total Operating Costs
   */
  public generateExecutiveDRE(data: RawExecutiveFinancialData): ExecutiveDREStatement {
    const grossRevenue = Number(data.commissionRevenue) || 0;
    const refunds = Number(data.refunds) || 0;
    const reversals = Number(data.reversals) || 0;
    const netRevenue = grossRevenue - refunds - reversals;

    const operatingCosts: OperatingCostsBreakdown = {
      aiCosts: Number(data.aiCosts) || 0,
      apiCosts: Number(data.apiCosts) || 0,
      contentCosts: Number(data.contentCosts) || 0,
      translationCosts: Number(data.translationCosts) || 0,
      publicationCosts: Number(data.publicationCosts) || 0,
      messagingCosts: Number(data.messagingCosts) || 0,
      infrastructureCosts: Number(data.infrastructureCosts) || 0,
      toolsCosts: Number(data.toolsCosts) || 0,
      otherCosts: Number(data.otherCosts) || 0,
      totalOperatingCosts: 0
    };

    operatingCosts.totalOperatingCosts =
      operatingCosts.aiCosts +
      operatingCosts.apiCosts +
      operatingCosts.contentCosts +
      operatingCosts.translationCosts +
      operatingCosts.publicationCosts +
      operatingCosts.messagingCosts +
      operatingCosts.infrastructureCosts +
      operatingCosts.toolsCosts +
      operatingCosts.otherCosts;

    const netProfit = netRevenue - operatingCosts.totalOperatingCosts;
    const profitMargin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;
    const roi = operatingCosts.totalOperatingCosts > 0
      ? (netProfit / operatingCosts.totalOperatingCosts) * 100
      : netProfit > 0 ? 100 : 0;

    return {
      date: data.date || new Date(),
      currency: data.currency || 'USD',
      grossRevenue: Number(grossRevenue.toFixed(4)),
      refunds: Number(refunds.toFixed(4)),
      reversals: Number(reversals.toFixed(4)),
      netRevenue: Number(netRevenue.toFixed(4)),
      commissionRevenue: Number(grossRevenue.toFixed(4)),
      operatingCosts: {
        aiCosts: Number(operatingCosts.aiCosts.toFixed(4)),
        apiCosts: Number(operatingCosts.apiCosts.toFixed(4)),
        contentCosts: Number(operatingCosts.contentCosts.toFixed(4)),
        translationCosts: Number(operatingCosts.translationCosts.toFixed(4)),
        publicationCosts: Number(operatingCosts.publicationCosts.toFixed(4)),
        messagingCosts: Number(operatingCosts.messagingCosts.toFixed(4)),
        infrastructureCosts: Number(operatingCosts.infrastructureCosts.toFixed(4)),
        toolsCosts: Number(operatingCosts.toolsCosts.toFixed(4)),
        otherCosts: Number(operatingCosts.otherCosts.toFixed(4)),
        totalOperatingCosts: Number(operatingCosts.totalOperatingCosts.toFixed(4))
      },
      netProfit: Number(netProfit.toFixed(4)),
      profitMargin: Number(profitMargin.toFixed(2)),
      roi: Number(roi.toFixed(2))
    };
  }
}
