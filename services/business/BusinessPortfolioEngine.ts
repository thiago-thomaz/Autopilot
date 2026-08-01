import { DiversificationAnalysis } from '../../types/business/business.types';

export interface RevenueSourceShare {
  productShare: Record<string, number>; // e.g. { prod1: 60, prod2: 40 }
  marketShare: Record<string, number>; // e.g. { US: 70, BR: 30 }
  channelShare: Record<string, number>; // e.g. { INSTAGRAM: 40, TELEGRAM: 60 }
  affiliateProgramShare: Record<string, number>; // e.g. { amazon: 80 }
}

export class BusinessPortfolioEngine {
  public analyzeDiversification(shares: RevenueSourceShare): DiversificationAnalysis {
    const maxProd = Math.max(0, ...Object.values(shares.productShare || { default: 0 }));
    const maxMarket = Math.max(0, ...Object.values(shares.marketShare || { default: 0 }));
    const maxChannel = Math.max(0, ...Object.values(shares.channelShare || { default: 0 }));
    const maxAffiliate = Math.max(0, ...Object.values(shares.affiliateProgramShare || { default: 0 }));

    const hasConcentrationRisk = maxProd > 50 || maxMarket > 50 || maxChannel > 50 || maxAffiliate > 50;

    // Score 100 = perfectly diversified, 0 = 100% single point of failure
    const highestConc = Math.max(maxProd, maxMarket, maxChannel, maxAffiliate);
    const diversificationScore = Math.max(0, Math.min(100, 100 - (highestConc - 25) * 1.33));

    let highestRiskFactor = 'NONE';
    if (highestConc === maxProd) highestRiskFactor = 'PRODUCT_CONCENTRATION';
    else if (highestConc === maxMarket) highestRiskFactor = 'MARKET_CONCENTRATION';
    else if (highestConc === maxChannel) highestRiskFactor = 'CHANNEL_CONCENTRATION';
    else if (highestConc === maxAffiliate) highestRiskFactor = 'AFFILIATE_PROGRAM_CONCENTRATION';

    return {
      diversificationScore: Number(diversificationScore.toFixed(2)),
      productConcentration: maxProd,
      marketConcentration: maxMarket,
      channelConcentration: maxChannel,
      affiliateProgramConcentration: maxAffiliate,
      hasConcentrationRisk,
      highestRiskFactor
    };
  }
}
