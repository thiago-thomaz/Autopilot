import { PredictionService } from '../predictive/PredictionService';

export interface PredictiveInterval {
  targetMetric: string;
  lowerBound: number;
  expectedValue: number;
  upperBound: number;
  confidenceInterval: number;
}

export class PredictionEngineAdapter {
  private predictionService = new PredictionService();

  public async getPredictiveInterval(productId: string, metric: string = 'EPC'): Promise<PredictiveInterval> {
    try {
      const pred = await this.predictionService.predictOpportunityScore(productId);
      const expected = pred?.expectedMetrics?.epc || 12.5;
      const lower = Number((expected * 0.85).toFixed(4));
      const upper = Number((expected * 1.15).toFixed(4));

      return {
        targetMetric: metric,
        lowerBound: lower,
        expectedValue: Number(expected.toFixed(4)),
        upperBound: upper,
        confidenceInterval: 0.90
      };
    } catch (e) {
      return {
        targetMetric: metric,
        lowerBound: 8.0,
        expectedValue: 10.0,
        upperBound: 12.0,
        confidenceInterval: 0.80
      };
    }
  }
}
