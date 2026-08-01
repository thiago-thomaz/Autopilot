export interface MarketRiskReport {
  country: string;
  overallRiskScore: number; // 0 to 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
}

export class MarketRiskEngine {
  public evaluateMarketRisk(country: string, competitionLevel: number = 50.0): MarketRiskReport {
    const code = country.toUpperCase();
    const factors: string[] = [];
    let riskScore = 20.0;

    if (competitionLevel > 70) {
      riskScore += 25;
      factors.push('High affiliate market saturation');
    }

    if (['BR', 'INR', 'ARG', 'TRY'].includes(code)) {
      riskScore += 20;
      factors.push('Currency exchange volatility risk');
    }

    if (['DE', 'FR'].includes(code)) {
      riskScore += 10;
      factors.push('Strict regulatory advertising enforcement');
    }

    const overallRiskScore = Math.min(100, Math.max(0, riskScore));
    const riskLevel = overallRiskScore > 60 ? 'HIGH' : overallRiskScore > 35 ? 'MEDIUM' : 'LOW';

    return {
      country: code,
      overallRiskScore,
      riskLevel,
      factors
    };
  }
}
