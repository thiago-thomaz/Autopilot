import { describe, it, expect } from 'vitest';
import { MarginalReturnEngine } from '../../../services/growth/MarginalReturnEngine';

describe('MarginalReturnEngine', () => {
  const engine = new MarginalReturnEngine();

  it('recommends SCALE when marginal return ratio is high and saturation is low', () => {
    const result = engine.evaluateMarginalReturn(
      {
        campaignId: 'cmp_1',
        currentBudget: 500,
        currentProfit: 1000,
        historicalProfits: [800, 1000],
        historicalBudgets: [400, 500],
        saturationFactor: 0.1
      },
      100
    );

    expect(result.recommendation).toBe('SCALE');
    expect(result.marginalReturnRatio).toBeGreaterThan(1.2);
  });

  it('recommends REDUCE when saturation factor is high', () => {
    const result = engine.evaluateMarginalReturn(
      {
        campaignId: 'cmp_2',
        currentBudget: 500,
        currentProfit: 600,
        historicalProfits: [550, 600],
        historicalBudgets: [450, 500],
        saturationFactor: 0.88
      },
      100
    );

    expect(result.recommendation).toBe('REDUCE');
  });
});
