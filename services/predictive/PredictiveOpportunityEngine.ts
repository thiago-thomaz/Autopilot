import { PredictiveOpportunity } from '../../types/predictive/predictive.types';
import { FeatureVector } from '../../types/predictive/features.types';

export class PredictiveOpportunityEngine {
  /**
   * Calculates Predictive Opportunity Score (0 - 100) combining Profit, ROI, CVR, EPC, and Confidence
   */
  public calculateOpportunityScore(
    featureVector: FeatureVector,
    title: string,
    category: string,
    country: string,
    expectedProfit: number,
    expectedROI: number,
    cvr: number,
    epc: number,
    confidenceScore: number
  ): PredictiveOpportunity {
    const positiveFactors: string[] = [];
    const negativeFactors: string[] = [];

    // Score components (Max 100)
    let score = 0;

    // Profit weight (up to 30 points)
    if (expectedProfit > 50) {
      score += 30;
      positiveFactors.push(`High expected profit ($${expectedProfit.toFixed(2)})`);
    } else if (expectedProfit > 10) {
      score += 20;
      positiveFactors.push(`Moderate expected profit ($${expectedProfit.toFixed(2)})`);
    } else if (expectedProfit > 0) {
      score += 10;
    } else {
      negativeFactors.push(`Negative or zero expected profit ($${expectedProfit.toFixed(2)})`);
    }

    // ROI weight (up to 25 points)
    if (expectedROI > 200) {
      score += 25;
      positiveFactors.push(`Exceptional ROI (${expectedROI.toFixed(0)}%)`);
    } else if (expectedROI > 50) {
      score += 18;
      positiveFactors.push(`Strong ROI (${expectedROI.toFixed(0)}%)`);
    } else if (expectedROI > 0) {
      score += 10;
    } else {
      negativeFactors.push(`Unfavorable ROI (${expectedROI.toFixed(0)}%)`);
    }

    // CVR weight (up to 25 points)
    if (cvr >= 0.04) {
      score += 25;
      positiveFactors.push(`High conversion probability (${(cvr * 100).toFixed(1)}%)`);
    } else if (cvr >= 0.02) {
      score += 15;
    } else {
      negativeFactors.push(`Low conversion probability (${(cvr * 100).toFixed(1)}%)`);
    }

    // Confidence modifier (up to 20 points)
    score += Math.round(confidenceScore * 20);

    const opportunityScore = Math.min(100, Math.max(0, score));
    const confidence = confidenceScore > 0.75 ? 'HIGH' : confidenceScore > 0.5 ? 'MEDIUM' : 'LOW';
    const riskScore = Number((100 - opportunityScore).toFixed(1));

    return {
      productId: featureVector.entityId,
      title,
      category,
      country,
      price: Number(featureVector.features['price'] ?? 0),
      expectedProfit: Number(expectedProfit.toFixed(2)),
      expectedROI: Number(expectedROI.toFixed(1)),
      cvrProbability: Number(cvr.toFixed(4)),
      expectedEPC: Number(epc.toFixed(4)),
      opportunityScore,
      confidence,
      confidenceScore,
      riskScore,
      positiveFactors,
      negativeFactors,
      disclaimer: 'ESTIMATE ONLY: Opportunity score is a predictive ranking signal. Actual profit and conversions are non-guaranteed.'
    };
  }
}
