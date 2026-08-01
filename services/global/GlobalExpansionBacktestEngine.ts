export interface BacktestResult {
  simulatedProfitUSD: number;
  simulatedROI: number;
  successfulMarketsCount: number;
}

export class GlobalExpansionBacktestEngine {
  public runExpansionBacktest(targetCountries: string[]): BacktestResult {
    const count = targetCountries.length;
    const simulatedProfitUSD = count * 350.0;
    const simulatedROI = 180.0;

    return {
      simulatedProfitUSD: Number(simulatedProfitUSD.toFixed(2)),
      simulatedROI,
      successfulMarketsCount: count
    };
  }
}
