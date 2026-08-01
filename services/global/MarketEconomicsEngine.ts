export interface NetMarketValueOutput {
  netMarketValue: number;
  expectedProfit: number;
  localizationCost: number;
  distributionCost: number;
  riskPenalty: number;
  recommendation: 'EXPAND' | 'TEST' | 'RESEARCH' | 'BLOCK';
}

export class MarketEconomicsEngine {
  public calculateNetValue(
    expectedProfit: number,
    localizationCost: number = 5.0,
    distributionCost: number = 2.0,
    riskScore: number = 20.0
  ): NetMarketValueOutput {
    // Risk penalty = (RiskScore / 100) * Expected Profit * 0.3
    const riskPenalty = (riskScore / 100) * expectedProfit * 0.3;
    const netMarketValue = expectedProfit - localizationCost - distributionCost - riskPenalty;

    const net = Number(netMarketValue.toFixed(2));

    let recommendation: 'EXPAND' | 'TEST' | 'RESEARCH' | 'BLOCK' = 'RESEARCH';
    if (net > 50) recommendation = 'EXPAND';
    else if (net > 10) recommendation = 'TEST';
    else if (net > 0) recommendation = 'RESEARCH';
    else recommendation = 'BLOCK';

    return {
      netMarketValue: net,
      expectedProfit: Number(expectedProfit.toFixed(2)),
      localizationCost: Number(localizationCost.toFixed(2)),
      distributionCost: Number(distributionCost.toFixed(2)),
      riskPenalty: Number(riskPenalty.toFixed(2)),
      recommendation
    };
  }
}
