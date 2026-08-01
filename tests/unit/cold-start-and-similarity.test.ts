import { describe, it, expect } from 'vitest';
import { ColdStartEngine } from '../../services/predictive/ColdStartEngine';
import { ProductSimilarityEngine } from '../../services/predictive/ProductSimilarityEngine';
import { FeatureVector } from '../../types/predictive/features.types';

describe('ColdStart & Similarity Engine Unit Tests', () => {
  const coldStartEngine = new ColdStartEngine();
  const similarityEngine = new ProductSimilarityEngine();

  it('should generate cold start prediction with LOW confidence for new entities', () => {
    const coldPrediction = coldStartEngine.generateColdStartPrediction('new-product-999', 'PRODUCT', 'SOFTWARE_SAAS', 199.0);

    expect(coldPrediction.isColdStart).toBe(true);
    expect(coldPrediction.confidenceLevel).toBe('LOW');
    expect(coldPrediction.confidenceScore).toBe(0.35);
    expect(coldPrediction.disclaimer).toContain('ESTIMATE ONLY');
  });

  it('should compute cosine similarity between two feature vectors', () => {
    const v1: FeatureVector = {
      entityId: 'prod-1',
      entityType: 'PRODUCT',
      timestamp: new Date().toISOString(),
      features: { price: 100, commissionRate: 0.1, ctr: 0.02 },
      freshnessScore: 1.0
    };

    const v2: FeatureVector = {
      entityId: 'prod-2',
      entityType: 'PRODUCT',
      timestamp: new Date().toISOString(),
      features: { price: 105, commissionRate: 0.1, ctr: 0.022 },
      freshnessScore: 1.0
    };

    const sim = similarityEngine.calculateCosineSimilarity(v1, v2);
    expect(sim).toBeGreaterThan(0.95);
  });
});
