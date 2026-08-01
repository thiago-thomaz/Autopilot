import { FeatureVector } from '../../types/predictive/features.types';
import { DataQualityEngine } from './DataQualityEngine';

export class FeatureEngineeringEngine {
  private dataQualityEngine: DataQualityEngine;

  constructor() {
    this.dataQualityEngine = new DataQualityEngine();
  }

  /**
   * Extracts feature vector from raw product / operation data while verifying anti-leakage
   */
  public extractFeatures(rawData: Record<string, unknown>, isTraining: boolean = true): FeatureVector {
    // Enforce anti-leakage check
    this.dataQualityEngine.verifyAntiLeakage(rawData, isTraining);

    const price = Number(rawData['price'] ?? 0);
    const commissionRate = Number(rawData['commissionRate'] ?? 0);
    const clicks = Number(rawData['clicks'] ?? 0);
    const impressions = Number(rawData['impressions'] ?? 1);
    const historicalConversions = Number(rawData['historicalConversions'] ?? 0);
    const historicalClicks = Number(rawData['historicalClicks'] ?? 1);

    const ctr = impressions > 0 ? clicks / impressions : 0;
    const historicalCVR = historicalClicks > 0 ? historicalConversions / historicalClicks : 0;
    const logPrice = price > 0 ? Math.log(price + 1) : 0;
    const expectedCommissionPerSale = price * commissionRate;

    const entityId = String(rawData['productId'] || rawData['entityId'] || 'unknown');

    return {
      entityId,
      entityType: (rawData['entityType'] as any) || 'PRODUCT',
      timestamp: new Date().toISOString(),
      features: {
        price,
        logPrice,
        commissionRate,
        expectedCommissionPerSale,
        clicks,
        impressions,
        ctr,
        historicalCVR,
        dayOfWeek: new Date().getDay(),
        hourOfDay: new Date().getHours()
      },
      freshnessScore: 1.0
    };
  }
}
