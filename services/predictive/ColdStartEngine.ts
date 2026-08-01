import { PredictionResult } from '../../types/predictive/predictive.types';

export interface CategoryPrior {
  category: string;
  baselineCVR: number; // e.g. 0.025 (2.5%)
  baselineCTR: number; // e.g. 0.015 (1.5%)
  baselineEPC: number; // e.g. 0.50
}

export class ColdStartEngine {
  private categoryPriors: Map<string, CategoryPrior> = new Map([
    ['ELECTRONICS', { category: 'ELECTRONICS', baselineCVR: 0.018, baselineCTR: 0.020, baselineEPC: 0.85 }],
    ['FASHION', { category: 'FASHION', baselineCVR: 0.028, baselineCTR: 0.025, baselineEPC: 0.45 }],
    ['HEALTH_BEAUTY', { category: 'HEALTH_BEAUTY', baselineCVR: 0.035, baselineCTR: 0.030, baselineEPC: 0.95 }],
    ['SOFTWARE_SAAS', { category: 'SOFTWARE_SAAS', baselineCVR: 0.040, baselineCTR: 0.018, baselineEPC: 2.10 }],
    ['HOME_GARDEN', { category: 'HOME_GARDEN', baselineCVR: 0.022, baselineCTR: 0.019, baselineEPC: 0.60 }]
  ]);

  private globalDefaultPrior: CategoryPrior = {
    category: 'GENERAL',
    baselineCVR: 0.020,
    baselineCTR: 0.020,
    baselineEPC: 0.50
  };

  /**
   * Generates a cold start estimate when historical samples are below minimum threshold (<10 samples).
   * Strictly marks confidence = LOW and sets explicit estimation disclaimer.
   */
  public generateColdStartPrediction(
    entityId: string,
    entityType: string,
    category?: string,
    price?: number
  ): PredictionResult {
    const prior = category ? (this.categoryPriors.get(category.toUpperCase()) || this.globalDefaultPrior) : this.globalDefaultPrior;
    
    // Adjust expected CVR based on price point (higher price -> slightly lower CVR prior)
    let cvr = prior.baselineCVR;
    if (price && price > 200) {
      cvr *= 0.7;
    } else if (price && price < 30) {
      cvr *= 1.25;
    }

    const predictedValue = Number(cvr.toFixed(4));
    const lowerBound = Number((predictedValue * 0.5).toFixed(4));
    const upperBound = Number((predictedValue * 1.8).toFixed(4));

    return {
      predictionType: 'CVR',
      entityType,
      entityId,
      predictedValue,
      lowerBound,
      upperBound,
      confidenceScore: 0.35, // Low confidence
      confidenceLevel: 'LOW',
      riskScore: 65.0, // High risk due to cold start
      modelVersion: 'COLD_START_PRIOR_V1',
      isColdStart: true,
      disclaimer: 'ESTIMATE ONLY: This prediction is based on category priors due to insufficient entity history. Yield or revenue is not guaranteed.',
      timestamp: new Date().toISOString()
    };
  }
}
