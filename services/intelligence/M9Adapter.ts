import { PredictionService } from '../predictive/PredictionService';

export class M9Adapter {
  private predictionService = new PredictionService();

  public async fetchPredictiveScores(productId: string) {
    try {
      const pred = await this.predictionService.predictOpportunityScore(productId);
      return {
        epc: pred?.expectedMetrics?.epc || 15.0,
        cvr: pred?.expectedMetrics?.cvr || 0.03,
        confidence: pred?.confidence || 0.85
      };
    } catch (e) {
      return { epc: 10.0, cvr: 0.02, confidence: 0.75 };
    }
  }
}
