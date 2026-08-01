import { ExecutiveBriefingReport } from '../../types/business/strategy.types';

export class ExecutiveReportEngine {
  public generateBriefing(
    grossRevenue: number,
    netProfit: number,
    operatingCosts: number,
    cashBalance: number,
    alerts: string[] = []
  ): ExecutiveBriefingReport {
    const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
    const roi = operatingCosts > 0 ? (netProfit / operatingCosts) * 100 : 0;

    return {
      date: new Date(),
      headline: `Daily Business Briefing: Net Profit $${netProfit.toFixed(2)} (${profitMargin.toFixed(1)}% margin)`,
      kpiSummary: {
        grossRevenue: Number(grossRevenue.toFixed(4)),
        netProfit: Number(netProfit.toFixed(4)),
        profitMargin: Number(profitMargin.toFixed(2)),
        roi: Number(roi.toFixed(2)),
        cashBalance: Number(cashBalance.toFixed(4))
      },
      goalProgressSummary: netProfit > 0 ? 'On Track to hit monthly profit targets' : 'Behind profit target',
      criticalAlerts: alerts,
      topStrategicActions: [
        'Scale top performing harvest campaigns',
        'Review AI token spend efficiency',
        'Check pending affiliate payout status'
      ]
    };
  }
}
