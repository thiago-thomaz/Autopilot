import { PredictionResult } from '../../types/predictive/predictive.types';

export class EnsemblePredictionEngine {
  /**
   * Combines sub-model predictions into a weighted ensemble prediction
   */
  public combinePredictions(
    predictions: Array<{ result: PredictionResult; weight: number }>
  ): PredictionResult {
    if (predictions.length === 0) {
      throw new Error('Cannot ensemble empty predictions array');
    }

    let totalWeight = 0;
    let weightedValue = 0;
    let weightedLower = 0;
    let weightedUpper = 0;
    let weightedConfidence = 0;

    for (const item of predictions) {
      totalWeight += item.weight;
      weightedValue += item.result.predictedValue * item.weight;
      weightedLower += item.result.lowerBound * item.weight;
      weightedUpper += item.result.upperBound * item.weight;
      weightedConfidence += item.result.confidenceScore * item.weight;
    }

    const normWeight = totalWeight > 0 ? totalWeight : 1;
    const finalValue = Number((weightedValue / normWeight).toFixed(4));
    const finalLower = Number((weightedLower / normWeight).toFixed(4));
    const finalUpper = Number((weightedUpper / normWeight).toFixed(4));
    const finalConfidence = Number((weightedConfidence / normWeight).toFixed(2));

    const first = predictions[0].result;

    return {
      predictionType: first.predictionType,
      entityType: first.entityType,
      entityId: first.entityId,
      predictedValue: finalValue,
      lowerBound: finalLower,
      upperBound: finalUpper,
      confidenceScore: finalConfidence,
      confidenceLevel: finalConfidence > 0.75 ? 'HIGH' : finalConfidence > 0.5 ? 'MEDIUM' : 'LOW',
      riskScore: Number((100 * (1 - finalConfidence)).toFixed(1)),
      modelVersion: 'ENSEMBLE_V1',
      isColdStart: false,
      disclaimer: 'ESTIMATE ONLY: Weighted ensemble prediction across statistical and ML models.',
      timestamp: new Date().toISOString()
    };
  }
}
