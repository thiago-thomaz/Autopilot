export class ScoringEngine {
  public calculateOpportunityScore(expectedNetProfit: number, cvr: number, epc: number, riskScore: number): number {
    return Number(
      Math.min(100, Math.max(0, expectedNetProfit * 0.05 + cvr * 500 + epc * 2 - riskScore * 0.5)).toFixed(2)
    );
  }
}
