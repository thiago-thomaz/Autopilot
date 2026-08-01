import { PredictionResult } from '../../types/predictive/predictive.types';
import { FeatureVector } from '../../types/predictive/features.types';

export class EPCPredictionModel {
  public predictEPC(featureVector: FeatureVector, cvr: number): PredictionResult {
    const price = Number(featureVector.features['price'] ?? 0);
    const commissionRate = Number(featureVector.features['commissionRate'] ?? 0.05);

    const commissionPerSale = price * commissionRate;
    const expectedEPC = cvr * commissionPerSale;

    const predictedValue = Number(expectedEPC.toFixed(4));
    const lowerBound = Number((predictedValue * 0.75).toFixed(4));
    const upperBound = Number((predictedValue * 1.25).toFixed(4));

    return {
      predictionType: 'EXPECTED_EPC',
      entityType: featureVector.entityType,
      entityId: featureVector.entityId,
      predictedValue,
      lowerBound,
      upperBound,
      confidenceScore: 0.80,
      confidenceLevel: 'HIGH',
      riskScore: 20.0,
      modelVersion: 'EPC_MODEL_V1',
      isColdStart: false,
      disclaimer: 'ESTIMATE ONLY: Forecasted Earnings Per Click (EPC). EPC varies dynamically by conversion conditions.',
      timestamp: new Date().toISOString()
    };
  }
}
