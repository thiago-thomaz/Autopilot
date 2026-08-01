import { describe, it, expect } from 'vitest';
import { TrueBusinessProfitEngine } from '../../../services/business/TrueBusinessProfitEngine';

describe('TrueBusinessProfitEngine (Executive DRE)', () => {
  const engine = new TrueBusinessProfitEngine();

  it('correctly calculates net profit subtracting all operating, AI, infra, and reversal costs with exact precision', () => {
    const dre = engine.generateExecutiveDRE({
      commissionRevenue: 25000,
      refunds: 300,
      reversals: 200,
      aiCosts: 500,
      apiCosts: 100,
      contentCosts: 200,
      translationCosts: 150,
      publicationCosts: 50,
      messagingCosts: 100,
      infrastructureCosts: 600,
      toolsCosts: 200,
      otherCosts: 100,
      currency: 'USD'
    });

    // Net Revenue = 25000 - 300 - 200 = 24500
    // Total Operating Costs = 500 + 100 + 200 + 150 + 50 + 100 + 600 + 200 + 100 = 2000
    // Net Profit = 24500 - 2000 = 22500
    // Profit Margin = (22500 / 24500) * 100 = 91.84%
    // ROI = (22500 / 2000) * 100 = 1125%

    expect(dre.grossRevenue).toBe(25000);
    expect(dre.netRevenue).toBe(24500);
    expect(dre.operatingCosts.totalOperatingCosts).toBe(2000);
    expect(dre.netProfit).toBe(22500);
    expect(dre.profitMargin).toBe(91.84);
    expect(dre.roi).toBe(1125);
    expect(dre.currency).toBe('USD');
  });
});
