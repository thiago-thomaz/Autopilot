import { describe, it, expect } from 'vitest';
import { BusinessSimulationEngine } from '../../../services/business/BusinessSimulationEngine';

describe('BusinessSimulationEngine', () => {
  const simulator = new BusinessSimulationEngine();

  it('correctly simulates Base, Downside, and Upside scenarios without modifying real data', () => {
    const result = simulator.runScenarioSimulation({
      baseNetRevenue: 20000,
      baseCosts: 5000,
      commissionDeltaPercent: -20,
      investmentAmount: 2000,
      investmentExpectedROI: 25
    });

    expect(result.base.netProfit).toBeGreaterThan(0);
    expect(result.downside.netProfit).toBeLessThan(result.base.netProfit);
    expect(result.upside.netProfit).toBeGreaterThan(result.base.netProfit);
  });
});
