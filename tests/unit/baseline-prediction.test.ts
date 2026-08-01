import { describe, it, expect } from 'vitest';
import { BaselinePredictionModel } from '../../services/predictive/BaselinePredictionModel';
import { FeatureVector } from '../../types/predictive/features.types';

describe('BaselinePredictionModel Unit Tests', () => {
  const baselineModel = new BaselinePredictionModel();

  it('should generate statistical baseline CVR prediction with bounds and disclaimer', () => {
    const mockVector: FeatureVector = {
      entityId: 'prod-test-01',
      entityType: 'PRODUCT',
      timestamp: new Date().toISOString(),
      features: {
        price: 99.99,
        commissionRate: 0.10,
        historicalCVR: 0.03
      },
      freshnessScore: 1.0
    };

    const result = baselineModel.predict(mockVector);

    expect(result).toBeDefined();
    expect(result.predictionType).toBe('CVR');
    expect(result.predictedValue).toBeGreaterThan(0);
    expect(result.lowerBound).toBeLessThanOrEqual(result.predictedValue);
    expect(result.upperBound).toBeGreaterThanOrEqual(result.predictedValue);
    expect(result.disclaimer).toContain('ESTIMATE ONLY');
  });
});
