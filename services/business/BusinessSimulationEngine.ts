export interface ScenarioInput {
  baseNetRevenue: number;
  baseCosts: number;
  commissionDeltaPercent?: number; // e.g. -20 for 20% commission drop
  investmentAmount?: number; // e.g. 5000 in DE market
  investmentExpectedROI?: number; // e.g. 30%
}

export interface ScenarioDetail {
  netRevenue: number;
  operatingCosts: number;
  netProfit: number;
  roi: number;
}

export interface BusinessSimulationOutput {
  downside: ScenarioDetail;
  base: ScenarioDetail;
  upside: ScenarioDetail;
}

export class BusinessSimulationEngine {
  public runScenarioSimulation(input: ScenarioInput): BusinessSimulationOutput {
    const { baseNetRevenue, baseCosts, commissionDeltaPercent = 0, investmentAmount = 0, investmentExpectedROI = 0 } = input;

    // Base Scenario
    const commissionMultiplier = 1 + commissionDeltaPercent / 100;
    const baseRev = baseNetRevenue * commissionMultiplier + (investmentAmount * (1 + investmentExpectedROI / 100));
    const baseCost = baseCosts + investmentAmount;
    const baseProfit = baseRev - baseCost;
    const baseROI = baseCost > 0 ? (baseProfit / baseCost) * 100 : 0;

    // Downside (0.8x rev, 1.1x cost)
    const downRev = baseRev * 0.8;
    const downCost = baseCost * 1.1;
    const downProfit = downRev - downCost;
    const downROI = downCost > 0 ? (downProfit / downCost) * 100 : 0;

    // Upside (1.25x rev, 0.95x cost)
    const upRev = baseRev * 1.25;
    const upCost = baseCost * 0.95;
    const upProfit = upRev - upCost;
    const upROI = upCost > 0 ? (upProfit / upCost) * 100 : 0;

    return {
      downside: {
        netRevenue: Number(downRev.toFixed(4)),
        operatingCosts: Number(downCost.toFixed(4)),
        netProfit: Number(downProfit.toFixed(4)),
        roi: Number(downROI.toFixed(2))
      },
      base: {
        netRevenue: Number(baseRev.toFixed(4)),
        operatingCosts: Number(baseCost.toFixed(4)),
        netProfit: Number(baseProfit.toFixed(4)),
        roi: Number(baseROI.toFixed(2))
      },
      upside: {
        netRevenue: Number(upRev.toFixed(4)),
        operatingCosts: Number(upCost.toFixed(4)),
        netProfit: Number(upProfit.toFixed(4)),
        roi: Number(upROI.toFixed(2))
      }
    };
  }
}
