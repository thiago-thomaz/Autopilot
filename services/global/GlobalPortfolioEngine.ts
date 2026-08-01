import { GlobalPortfolioSummary } from '../../types/global/global.types';

export class GlobalPortfolioEngine {
  public calculatePortfolioConcentration(portfolios: GlobalPortfolioSummary[]): {
    totalExpectedProfit: number;
    highestConcentrationCountry: string;
    concentrationRiskScore: number; // 0 to 100
  } {
    const totalProfit = portfolios.reduce((sum, p) => sum + p.expectedProfit, 0) || 1;
    let highestProfit = 0;
    let highestCountry = 'US';

    for (const p of portfolios) {
      if (p.expectedProfit > highestProfit) {
        highestProfit = p.expectedProfit;
        highestCountry = p.country;
      }
    }

    const share = highestProfit / totalProfit;
    const concentrationRiskScore = Number((share * 100).toFixed(1));

    return {
      totalExpectedProfit: Number(totalProfit.toFixed(2)),
      highestConcentrationCountry: highestCountry,
      concentrationRiskScore
    };
  }
}
