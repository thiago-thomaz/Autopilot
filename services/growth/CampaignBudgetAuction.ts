export interface CampaignBid {
  campaignId: string;
  expectedROI: number;
  expectedNetProfit: number;
  confidence: number;
  maxRequestedBudget: number;
  riskScore: number;
}

export interface AuctionResult {
  winningBids: { campaignId: string; awardedBudget: number; bidScore: number }[];
  totalDistributed: number;
  remainingPool: number;
}

export class CampaignBudgetAuction {
  /**
   * Conducts an internal auction for available budget based on expected ROI, net profit, confidence, and risk score.
   */
  public runAuction(availablePool: number, bids: CampaignBid[]): AuctionResult {
    if (availablePool <= 0 || bids.length === 0) {
      return { winningBids: [], totalDistributed: 0, remainingPool: availablePool };
    }

    // Bid Score formula = Expected ROI * Confidence * (1 - RiskScore/100)
    const scoredBids = bids.map((bid) => {
      const riskFactor = Math.max(0.1, 1 - Math.min(100, bid.riskScore) / 100);
      const score = Math.max(0.01, bid.expectedROI * bid.confidence * riskFactor);
      return { ...bid, score };
    }).sort((a, b) => b.score - a.score);

    let currentPool = availablePool;
    const winningBids: { campaignId: string; awardedBudget: number; bidScore: number }[] = [];

    for (const bid of scoredBids) {
      if (currentPool <= 0) break;
      const award = Math.min(bid.maxRequestedBudget, currentPool);
      if (award > 0) {
        winningBids.push({
          campaignId: bid.campaignId,
          awardedBudget: Number(award.toFixed(4)),
          bidScore: Number(bid.score.toFixed(4))
        });
        currentPool -= award;
      }
    }

    return {
      winningBids,
      totalDistributed: Number((availablePool - currentPool).toFixed(4)),
      remainingPool: Number(currentPool.toFixed(4))
    };
  }
}
