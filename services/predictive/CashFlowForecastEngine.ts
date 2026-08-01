export interface CashFlowScheduleItem {
  date: string;
  expectedInflow: number;
  expectedOutflow: number;
  netCashFlow: number;
  status: 'PENDING_PAYOUT_HOLD' | 'CLEARING' | 'AVAILABLE';
}

export class CashFlowForecastEngine {
  public generateCashFlowForecast(
    expectedCommissions: number,
    outflowCosts: number,
    payoutHoldDays: number = 30
  ): CashFlowScheduleItem[] {
    const today = new Date();
    const payoutDate = new Date(today.getTime() + payoutHoldDays * 24 * 60 * 60 * 1000);

    return [
      {
        date: today.toISOString().split('T')[0],
        expectedInflow: 0,
        expectedOutflow: Number(outflowCosts.toFixed(2)),
        netCashFlow: Number((-outflowCosts).toFixed(2)),
        status: 'PENDING_PAYOUT_HOLD'
      },
      {
        date: payoutDate.toISOString().split('T')[0],
        expectedInflow: Number(expectedCommissions.toFixed(2)),
        expectedOutflow: 0,
        netCashFlow: Number(expectedCommissions.toFixed(2)),
        status: 'AVAILABLE'
      }
    ];
  }
}
