export class GlobalRiskEngine {
  public evaluateGlobalRisk(activeCountries: string[]): { globalRiskScore: number; status: 'HEALTHY' | 'MODERATE_RISK' | 'HIGH_RISK' } {
    let score = 15.0; // Baseline global risk

    if (activeCountries.length < 2) {
      score += 30; // High single-market dependency risk
    }

    const globalRiskScore = Math.min(100, score);
    const status = globalRiskScore > 50 ? 'HIGH_RISK' : globalRiskScore > 30 ? 'MODERATE_RISK' : 'HEALTHY';

    return { globalRiskScore, status };
  }
}
