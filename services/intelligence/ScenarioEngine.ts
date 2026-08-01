import { ScenarioSimulationResult } from '../../types/intelligence/decision.types';

export class ScenarioEngine {
  public runScenarioSimulation(baseProfit: number, baseCosts: number): ScenarioSimulationResult[] {
    const baseROI = baseCosts > 0 ? (baseProfit / baseCosts) * 100 : 0;

    return [
      {
        scenarioName: 'Base',
        projectedNetProfit: Number(baseProfit.toFixed(4)),
        projectedROI: Number(baseROI.toFixed(2)),
        probability: 0.6,
        riskFactor: 0.2
      },
      {
        scenarioName: 'Best',
        projectedNetProfit: Number((baseProfit * 1.3).toFixed(4)),
        projectedROI: Number((baseROI * 1.3).toFixed(2)),
        probability: 0.2,
        riskFactor: 0.1
      },
      {
        scenarioName: 'Worst',
        projectedNetProfit: Number((baseProfit * 0.7).toFixed(4)),
        projectedROI: Number((baseROI * 0.7).toFixed(2)),
        probability: 0.2,
        riskFactor: 0.5
      }
    ];
  }
}
