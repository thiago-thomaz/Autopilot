import { PredictionResult } from '../../types/predictive/predictive.types';

export class SEOOpportunityModel {
  public predictSEOYield(
    keywordDifficulty: number, // 0 to 100
    monthlySearchVolume: number,
    targetRank: number = 3
  ): PredictionResult {
    // Estimated CTR by position (Rank 1: 30%, Rank 3: 10%, Rank 10: 1%)
    let organicCTR = 0.10;
    if (targetRank === 1) organicCTR = 0.30;
    else if (targetRank > 5) organicCTR = 0.03;

    const estimatedOrganicClicks = monthlySearchVolume * organicCTR;
    const assumedCVR = 0.025;
    const estimatedConversions = estimatedOrganicClicks * assumedCVR;

    const predictedValue = Number(estimatedConversions.toFixed(2));
    const lowerBound = Number((predictedValue * 0.4).toFixed(2));
    const upperBound = Number((predictedValue * 1.8).toFixed(2));

    const rankProbability = Math.max(0.1, 1 - (keywordDifficulty / 100));

    return {
      predictionType: 'SEO',
      entityType: 'SEO_KEYWORD',
      entityId: `seo-${Date.now()}`,
      predictedValue,
      lowerBound,
      upperBound,
      confidenceScore: Number(rankProbability.toFixed(2)),
      confidenceLevel: rankProbability > 0.6 ? 'MEDIUM' : 'LOW',
      riskScore: Number((100 * (1 - rankProbability)).toFixed(1)),
      modelVersion: 'SEO_MODEL_V1',
      isColdStart: false,
      disclaimer: 'ESTIMATE ONLY: Forecasted organic search traffic yield. Search rankings fluctuate dynamically based on engine algorithms.',
      timestamp: new Date().toISOString()
    };
  }
}
