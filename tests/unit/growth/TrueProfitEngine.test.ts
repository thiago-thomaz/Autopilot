import { describe, it, expect } from 'vitest';
import { TrueProfitEngine } from '../../../services/growth/TrueProfitEngine';

describe('TrueProfitEngine', () => {
  const engine = new TrueProfitEngine();

  it('correctly calculates net profit subtracting all operational, AI, and content costs', () => {
    const breakdown = engine.calculateNetProfit({
      commission: 1000,
      refunds: 50,
      reversals: 30,
      aiCosts: 20,
      contentCosts: 50,
      localizationCosts: 10,
      publicationCosts: 5,
      messagingCosts: 15,
      infrastructureCosts: 20,
      currency: 'USD'
    });

    const expectedCosts = 50 + 30 + 20 + 50 + 10 + 5 + 15 + 20; // 200
    const expectedProfit = 1000 - expectedCosts; // 800
    const expectedROI = (800 / 200) * 100; // 400%

    expect(breakdown.grossCommission).toBe(1000);
    expect(breakdown.totalCosts).toBe(200);
    expect(breakdown.netProfit).toBe(800);
    expect(breakdown.roi).toBe(400);
    expect(breakdown.currency).toBe('USD');
  });

  it('evaluates profitability thresholds correctly', () => {
    const profitable = engine.calculateNetProfit({ commission: 500, aiCosts: 50 });
    const unprofitable = engine.calculateNetProfit({ commission: 50, aiCosts: 100 });

    expect(engine.isProfitable(profitable, 50)).toBe(true);
    expect(engine.isProfitable(unprofitable, 0)).toBe(false);
  });
});
