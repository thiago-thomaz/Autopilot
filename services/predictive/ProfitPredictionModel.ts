import { PredictionResult } from '../../types/predictive/predictive.types';
import { FeatureVector } from '../../types/predictive/features.types';

export class ProfitPredictionModel {
  public predictProfit(
    featureVector: FeatureVector,
    expectedRevenue: number,
    expectedCost: number
  ): PredictionResult {
    const expectedProfit = expectedRevenue - expectedCost;

    const predictedValue = Number(expectedProfit.toFixed(4));
    const lowerBound = Number((predictedValue - Math.abs(predictedValue * 0.4)).toFixed(4));
    const upperBound = Number((predictedValue + Math.abs(predictedValue * 0.4)).toFixed(4));

    const confidenceScore = expectedProfit > 0 ? 0.75 : 0.60;
    const confidenceLevel = confidenceScore > 0.7 ? 'HIGH' : 'MEDIUM';

    return {
      predictionType: 'EXPECTED_PROFIT',
      entityType: featureVector.entityType,
      entityId: featureVector.entityId,
      predictedValue,
      lowerBound,
      upperBound,
      confidenceScore,
      confidenceLevel,
      riskScore: expectedProfit < 0 ? 80.0 : 25.0,
      modelVersion: 'PROFIT_MODEL_V1',
      isColdStart: false,
      disclaimer: 'ESTIMATE ONLY: Forecasted net profit. Net profit is never guaranteed.',
      timestamp: new Date().toISOString()
    };
  }
}
