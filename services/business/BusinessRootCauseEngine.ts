export interface MetricDropData {
  metricName: string;
  previousValue: number;
  currentValue: number;
  dropPercentage: number;
  potentialDrivers: { factor: string; contributionPercentage: number }[];
}

export class BusinessRootCauseEngine {
  public analyzeMetricDrop(
    metricName: string,
    previousValue: number,
    currentValue: number,
    costIncreases?: { category: string; delta: number },
    conversionDrop?: number
  ): MetricDropData {
    const dropPercentage = previousValue > 0
      ? Number((((previousValue - currentValue) / previousValue) * 100).toFixed(2))
      : 0;

    const potentialDrivers: { factor: string; contributionPercentage: number }[] = [];

    if (conversionDrop && conversionDrop > 0) {
      potentialDrivers.push({
        factor: 'Conversion Rate (CVR) drop due to traffic decay or out-of-stock offer',
        contributionPercentage: 60
      });
    }

    if (costIncreases && costIncreases.delta > 0) {
      potentialDrivers.push({
        factor: `Cost spike in ${costIncreases.category} cost center`,
        contributionPercentage: 40
      });
    }

    if (potentialDrivers.length === 0) {
      potentialDrivers.push({
        factor: 'Natural market seasonality fluctuation',
        contributionPercentage: 100
      });
    }

    return {
      metricName,
      previousValue,
      currentValue,
      dropPercentage,
      potentialDrivers
    };
  }
}
