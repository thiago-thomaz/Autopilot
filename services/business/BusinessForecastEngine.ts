export interface BusinessForecastResult {
  horizonDays: number;
  projectedRevenue: number;
  projectedOperatingCosts: number;
  projectedNetProfit: number;
  projectedROI: number;
  confidenceScore: number;
}

export class BusinessForecastEngine {
  public forecast(
    currentDailyRevenue: number,
    currentDailyCosts: number,
    horizonDays: number = 30,
    growthRateFactor: number = 1.05
  ): BusinessForecastResult {
    let accumulatedRevenue = 0;
    let accumulatedCosts = 0;

    for (let day = 1; day <= horizonDays; day++) {
      const dailyGrowth = Math.pow(growthRateFactor, day / 30);
      accumulatedRevenue += currentDailyRevenue * dailyGrowth;
      accumulatedCosts += currentDailyCosts * Math.pow(1.02, day / 30);
    }

    const projectedNetProfit = accumulatedRevenue - accumulatedCosts;
    const projectedROI = accumulatedCosts > 0 ? (projectedNetProfit / accumulatedCosts) * 100 : 0;

    return {
      horizonDays,
      projectedRevenue: Number(accumulatedRevenue.toFixed(4)),
      projectedOperatingCosts: Number(accumulatedCosts.toFixed(4)),
      projectedNetProfit: Number(projectedNetProfit.toFixed(4)),
      projectedROI: Number(projectedROI.toFixed(2)),
      confidenceScore: 0.85
    };
  }
}
