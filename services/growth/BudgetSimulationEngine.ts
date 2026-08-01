import { GrowthSimulationEngine } from './GrowthSimulationEngine';
import { SimulationResult } from '../../types/growth/growth.types';

export interface BudgetWhatIfInput {
  totalBudget: number;
  allocations: { category: string; amount: number; estimatedROI: number }[];
  volatility?: number;
}

export interface BudgetWhatIfResult {
  totalBudget: number;
  scenarios: {
    conservative: SimulationResult;
    base: SimulationResult;
    aggressive: SimulationResult;
  };
}

export class BudgetSimulationEngine {
  private simulator = new GrowthSimulationEngine();

  public runWhatIfAnalysis(input: BudgetWhatIfInput): BudgetWhatIfResult {
    const totalROI = input.allocations.reduce(
      (sum, a) => sum + (a.amount / Math.max(1, input.totalBudget)) * a.estimatedROI,
      0
    );

    const volatility = input.volatility || 0.15;

    const conservative = this.simulator.simulateTrajectory(
      { baseBudget: input.totalBudget, expectedROI: totalROI, volatility },
      'CONSERVATIVE'
    );
    const base = this.simulator.simulateTrajectory(
      { baseBudget: input.totalBudget, expectedROI: totalROI, volatility },
      'BASE'
    );
    const aggressive = this.simulator.simulateTrajectory(
      { baseBudget: input.totalBudget, expectedROI: totalROI, volatility },
      'AGGRESSIVE'
    );

    return {
      totalBudget: input.totalBudget,
      scenarios: {
        conservative,
        base,
        aggressive
      }
    };
  }
}
