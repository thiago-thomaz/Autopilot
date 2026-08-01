import { SimulationResult } from '../../types/growth/growth.types';

export interface SimulationParams {
  baseBudget: number;
  expectedROI: number; // e.g. 25 (%)
  volatility: number; // e.g. 0.15 (15% SD)
  iterations?: number;
}

export class GrowthSimulationEngine {
  public simulateTrajectory(
    params: SimulationParams,
    scenario: 'CONSERVATIVE' | 'BASE' | 'AGGRESSIVE' = 'BASE'
  ): SimulationResult {
    const iterations = params.iterations || 1000;
    const scenarioMultipliers = {
      CONSERVATIVE: 0.7,
      BASE: 1.0,
      AGGRESSIVE: 1.3
    };

    const multiplier = scenarioMultipliers[scenario];
    const meanROI = (params.expectedROI / 100) * multiplier;
    const stdDev = params.volatility;

    const outcomes: number[] = [];
    let profitableCount = 0;

    for (let i = 0; i < iterations; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      const sampledROI = meanROI + z * stdDev;
      const profit = params.baseBudget * sampledROI;
      outcomes.push(profit);

      if (profit > 0) profitableCount++;
    }

    outcomes.sort((a, b) => a - b);
    const sum = outcomes.reduce((acc, v) => acc + v, 0);
    const expectedProfit = sum / iterations;
    const expectedRevenue = params.baseBudget + expectedProfit;
    const expectedROI = (expectedProfit / params.baseBudget) * 100;

    const p5 = outcomes[Math.floor(iterations * 0.05)];
    const p95 = outcomes[Math.floor(iterations * 0.95)];

    return {
      scenario,
      iterations,
      expectedRevenue: Number(expectedRevenue.toFixed(4)),
      expectedProfit: Number(expectedProfit.toFixed(4)),
      expectedROI: Number(expectedROI.toFixed(2)),
      probabilityOfProfitability: Number(((profitableCount / iterations) * 100).toFixed(2)),
      downsideRisk: Number(Math.abs(Math.min(0, p5)).toFixed(4)),
      confidenceInterval: [Number(p5.toFixed(4)), Number(p95.toFixed(4))]
    };
  }
}
