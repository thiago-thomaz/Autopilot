import { MarketOpportunityResult } from '../../types/global/global.types';
import { MarketEconomicsEngine } from './MarketEconomicsEngine';
import { ProductMarketFitEngine } from './ProductMarketFitEngine';
import { MarketRiskEngine } from './MarketRiskEngine';

export class GlobalOpportunityEngine {
  private economicsEngine: MarketEconomicsEngine;
  private fitEngine: ProductMarketFitEngine;
  private riskEngine: MarketRiskEngine;

  constructor() {
    this.economicsEngine = new MarketEconomicsEngine();
    this.fitEngine = new ProductMarketFitEngine();
    this.riskEngine = new MarketRiskEngine();
  }

  public evaluateGlobalOpportunity(
    productId: string,
    category: string,
    country: string,
    language: string,
    currency: string,
    channel: string,
    expectedProfit: number,
    expectedROI: number
  ): MarketOpportunityResult {
    const fitScore = this.fitEngine.calculateFitScore(category, country);
    const risk = this.riskEngine.evaluateMarketRisk(country);
    const econ = this.economicsEngine.calculateNetValue(expectedProfit, 5.0, 2.0, risk.overallRiskScore);

    const opportunityScore = Math.min(100, Math.max(0, Math.round(fitScore * 0.4 + (100 - risk.overallRiskScore) * 0.3 + (econ.netMarketValue > 0 ? 30 : 0))));

    return {
      productId,
      country,
      language,
      currency,
      channel,
      opportunityScore,
      expectedProfit: Number(expectedProfit.toFixed(2)),
      expectedROI: Number(expectedROI.toFixed(1)),
      confidence: 0.8,
      riskScore: risk.overallRiskScore,
      localizationCost: econ.localizationCost,
      netMarketValue: econ.netMarketValue,
      recommendation: econ.recommendation as any,
      status: 'ACTIVE'
    };
  }
}
