export interface TrendResult {
  direction: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  momentumScore: number; // -1.0 to 1.0
  seasonalityDetected: boolean;
  breakoutPotential: boolean;
}

export class TrendDetectionEngine {
  public analyzeTrend(timeSeriesValues: number[]): TrendResult {
    if (timeSeriesValues.length < 3) {
      return {
        direction: 'STABLE',
        momentumScore: 0.0,
        seasonalityDetected: false,
        breakoutPotential: false
      };
    }

    const n = timeSeriesValues.length;
    const recent = timeSeriesValues[n - 1];
    const past = timeSeriesValues[0];
    const delta = recent - past;

    const momentumScore = Math.max(-1.0, Math.min(1.0, delta / (past || 1)));
    const direction = momentumScore > 0.15 ? 'UPWARD' : momentumScore < -0.15 ? 'DOWNWARD' : 'STABLE';
    const breakoutPotential = momentumScore > 0.5;

    return {
      direction,
      momentumScore: Number(momentumScore.toFixed(2)),
      seasonalityDetected: n >= 7,
      breakoutPotential
    };
  }
}
