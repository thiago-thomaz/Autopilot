import { describe, it, expect } from 'vitest';
import { PredictionService } from '../../services/predictive/PredictionService';

describe('Module 9 - AI Learning & Predictive Intelligence Engine (E2E Pipeline Test)', () => {
  const predictionService = new PredictionService();

  it('should execute end-to-end predictive pipeline: raw data -> feature extraction -> predictions -> confidence bounds -> opportunity scoring', async () => {
    const rawData = {
      productId: 'prod-e2e-101',
      title: 'Ultra High Yield Fitness Kit',
      category: 'HEALTH_BEAUTY',
      country: 'US',
      price: 89.99,
      commissionRate: 0.15,
      clicks: 500,
      cost: 20.0,
      sampleCount: 15
    };

    const output = await predictionService.predictEntityOpportunity(rawData);

    // Verify all predictions are populated
    expect(output.cvrPrediction).toBeDefined();
    expect(output.profitPrediction).toBeDefined();
    expect(output.roiPrediction).toBeDefined();
    expect(output.epcPrediction).toBeDefined();
    expect(output.opportunity).toBeDefined();

    // Verify numeric calculations
    expect(output.opportunity.opportunityScore).toBeGreaterThanOrEqual(0);
    expect(output.opportunity.opportunityScore).toBeLessThanOrEqual(100);
    expect(output.cvrPrediction.lowerBound).toBeLessThanOrEqual(output.cvrPrediction.upperBound);
    expect(output.profitPrediction.disclaimer).toContain('ESTIMATE ONLY');
  });
});
