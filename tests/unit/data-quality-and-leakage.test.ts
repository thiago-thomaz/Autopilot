import { describe, it, expect } from 'vitest';
import { DataQualityEngine } from '../../services/predictive/DataQualityEngine';
import { DataLeakageError } from '../../types/predictive/predictive.errors';

describe('DataQualityEngine & Anti-Leakage Tests', () => {
  const qualityEngine = new DataQualityEngine();

  it('should calculate data quality score for complete raw data', () => {
    const rawData = {
      productId: 'p-100',
      category: 'ELECTRONICS',
      price: 50.0,
      clicks: 100,
      CTR: 0.02
    };

    const report = qualityEngine.evaluateQuality(rawData);
    expect(report.score).toBeGreaterThan(80);
    expect(report.passedAntiLeakage).toBe(true);
  });

  it('should throw DataLeakageError if forbidden post-conversion features are present in training mode', () => {
    const leakedData = {
      productId: 'p-100',
      category: 'ELECTRONICS',
      price: 50.0,
      actualConversions: 5, // Forbidden post-conversion feature!
      actualRevenue: 250.0
    };

    expect(() => qualityEngine.verifyAntiLeakage(leakedData, true)).toThrow(DataLeakageError);
  });
});
