import { describe, it, expect } from 'vitest';
import { ModelRouter } from '../../services/predictive/ModelRouter';
import { ModelRegistry } from '../../services/predictive/ModelRegistry';
import { FeatureVector } from '../../types/predictive/features.types';

describe('Circuit Breaker & Fallback Tests', () => {
  it('should route to baseline model if ML model fails or is uninitialized', () => {
    const registry = new ModelRegistry();
    const router = new ModelRouter(registry);

    const featureVector: FeatureVector = {
      entityId: 'entity-test',
      entityType: 'PRODUCT',
      timestamp: new Date().toISOString(),
      features: { price: 50, ctr: 0.02 },
      freshnessScore: 1.0
    };

    const result = router.routePrediction('NON_EXISTENT_TARGET', featureVector);
    expect(result).toBeDefined();
    expect(result.modelVersion).toContain('BASELINE');
  });
});
