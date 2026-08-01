import { describe, it, expect } from 'vitest';
import { GrowthExperimentController } from '../../../services/growth/GrowthExperimentController';

describe('GrowthExperimentController', () => {
  const controller = new GrowthExperimentController();

  it('determines winner when sample size and confidence threshold are met', () => {
    const result = controller.evaluateExperiment(
      {
        id: 'exp_1',
        campaignId: 'cmp_1',
        experimentType: 'HOOK',
        hypothesis: 'Price drop hook wins',
        minimumSample: 100,
        confidenceThreshold: 0.90
      },
      { variantId: 'v_control', sampleSize: 500, conversions: 25, revenue: 500, cvr: 0.05 },
      { variantId: 'v_treatment', sampleSize: 500, conversions: 50, revenue: 1000, cvr: 0.10 }
    );

    expect(result.isConclusive).toBe(true);
    expect(result.winnerVariantId).toBe('v_treatment');
    expect(result.liftPercentage).toBe(100);
  });
});
