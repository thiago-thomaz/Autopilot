export interface PeriodForecast {
  periodDays: number;
  expectedProfit: number;
  lowerBound: number;
  upperBound: number;
}

export class ProfitForecastEngine {
  public forecastProfit(dailyExpectedProfit: number, confidenceScore: number): PeriodForecast[] {
    const horizons = [7, 30, 90];

    return horizons.map(days => {
      const expectedProfit = dailyExpectedProfit * days;
      const margin = expectedProfit * (1 - confidenceScore);
      return {
        periodDays: days,
        expectedProfit: Number(expectedProfit.toFixed(2)),
        lowerBound: Number(Math.max(0, expectedProfit - margin).toFixed(2)),
        upperBound: Number((expectedProfit + margin).toFixed(2))
      };
    });
  }
}
