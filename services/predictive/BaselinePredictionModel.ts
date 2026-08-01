import { PredictionResult } from '../../types/predictive/predictive.types';
import { FeatureVector } from '../../types/predictive/features.types';

export class BaselinePredictionModel {
  public static readonly VERSION = 'BASELINE_STATISTICAL_V1';

  /**
   * Generates a statistical baseline prediction using Bayesian smoothed historical mean
   */
  public predict(featureVector: FeatureVector, historicalSamples?: number[]): PredictionResult {
    const historicalCVR = Number(featureVector.features['historicalCVR'] ?? 0.02);
    const priorCVR = 0.025; // Global statistical prior
    const pseudoCount = 20; // Bayesian smoothing weight

    const n = historicalSamples ? historicalSamples.length : 5;
    const sampleMean = historicalSamples && historicalSamples.length > 0
      ? historicalSamples.reduce((a, b) => a + b, 0) / n
      : historicalCVR;

    // Bayesian shrinkage formula: (n * sampleMean + m * prior) / (n + m)
    const smoothedCVR = (n * sampleMean + pseudoCount * priorCVR) / (n + pseudoCount);

    const predictedValue = Number(smoothedCVR.toFixed(4));
    const margin = 0.3 * predictedValue;
    const lowerBound = Number(Math.max(0.001, predictedValue - margin).toFixed(4));
    const upperBound = Number((predictedValue + margin).toFixed(4));

    const confidenceScore = Math.min(0.85, 0.4 + (n / 100));
    const confidenceLevel = confidenceScore > 0.7 ? 'HIGH' : confidenceScore > 0.5 ? 'MEDIUM' : 'LOW';

    return {
      predictionType: 'CVR',
      entityType: featureVector.entityType,
      entityId: featureVector.entityId,
      predictedValue,
      lowerBound,
      upperBound,
      confidenceScore,
      confidenceLevel,
      riskScore: Number((100 * (1 - confidenceScore)).toFixed(1)),
      modelVersion: BaselinePredictionModel.VERSION,
      isColdStart: n < 5,
      disclaimer: 'ESTIMATE ONLY: Statistical baseline prediction. Past performance does not guarantee future conversion or revenue.',
      timestamp: new Date().toISOString()
    };
  }
}
