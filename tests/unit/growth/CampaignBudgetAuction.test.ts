import { describe, it, expect } from 'vitest';
import { CampaignBudgetAuction } from '../../../services/growth/CampaignBudgetAuction';

describe('CampaignBudgetAuction', () => {
  const auction = new CampaignBudgetAuction();

  it('guarantees total distributed budget never exceeds available pool limit', () => {
    const availablePool = 500;
    const bids = [
      { campaignId: 'c1', expectedROI: 50, expectedNetProfit: 200, confidence: 0.9, maxRequestedBudget: 400, riskScore: 10 },
      { campaignId: 'c2', expectedROI: 40, expectedNetProfit: 150, confidence: 0.8, maxRequestedBudget: 300, riskScore: 15 },
      { campaignId: 'c3', expectedROI: 30, expectedNetProfit: 100, confidence: 0.7, maxRequestedBudget: 200, riskScore: 20 }
    ];

    const result = auction.runAuction(availablePool, bids);

    expect(result.totalDistributed).toBeLessThanOrEqual(availablePool);
    expect(result.totalDistributed).toBe(500);
    expect(result.remainingPool).toBe(0);
  });
});
