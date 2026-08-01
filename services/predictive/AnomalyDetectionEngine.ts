export interface AnomalyReport {
  isAnomaly: boolean;
  zScore: number;
  expectedRange: { min: number; max: number };
  metric: string;
}

export class AnomalyDetectionEngine {
  public detectAnomaly(metricName: string, value: number, historicalValues: number[]): AnomalyReport {
    if (historicalValues.length === 0) {
      return { isAnomaly: false, zScore: 0, expectedRange: { min: value, max: value }, metric: metricName };
    }

    const mean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
    const variance = historicalValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / historicalValues.length;
    const stdDev = Math.sqrt(variance) || 0.001;

    const zScore = (value - mean) / stdDev;
    const isAnomaly = Math.abs(zScore) > 3.0; // 3 sigma rule

    return {
      isAnomaly,
      zScore: Number(zScore.toFixed(2)),
      expectedRange: {
        min: Number((mean - 2 * stdDev).toFixed(4)),
        max: Number((mean + 2 * stdDev).toFixed(4))
      },
      metric: metricName
    };
  }
}
