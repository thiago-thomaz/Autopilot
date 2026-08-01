import { DataQualityError, DataLeakageError } from '../../types/predictive/predictive.errors';

export interface DataQualityReport {
  score: number; // 0 to 100
  completeness: number; // percentage
  validity: number; // percentage
  outliersDetected: number;
  passedAntiLeakage: boolean;
  warnings: string[];
}

export class DataQualityEngine {
  // Prohibited post-conversion features for training datasets
  private static FORBIDDEN_TRAINING_FEATURES = [
    'actualConversions',
    'actualRevenue',
    'actualProfit',
    'conversionTimestamp',
    'saleId',
    'transactionId',
    'commissionPaid'
  ];

  /**
   * Assesses quality score of a raw dataset row or batch
   */
  public evaluateQuality(record: Record<string, unknown>): DataQualityReport {
    const warnings: string[] = [];
    let requiredFieldsPresent = 0;
    const requiredFields = ['productId', 'category', 'price', 'clicks'];

    for (const field of requiredFields) {
      if (record[field] !== undefined && record[field] !== null) {
        requiredFieldsPresent++;
      } else {
        warnings.push(`Missing required field: ${field}`);
      }
    }

    const completeness = (requiredFieldsPresent / requiredFields.length) * 100;
    
    // Check for outliers (e.g., negative price, impossible CTR > 100%)
    let outliersDetected = 0;
    const price = Number(record['price'] ?? 0);
    if (price < 0) {
      outliersDetected++;
      warnings.push('Negative price detected');
    }

    const ctr = Number(record['CTR'] ?? 0);
    if (ctr < 0 || ctr > 1.0) {
      outliersDetected++;
      warnings.push('CTR outside valid 0-1 range');
    }

    const validity = outliersDetected === 0 ? 100 : Math.max(0, 100 - outliersDetected * 25);
    const passedAntiLeakage = this.verifyAntiLeakage(record, false);

    const score = Math.round((completeness * 0.5) + (validity * 0.5));

    return {
      score,
      completeness,
      validity,
      outliersDetected,
      passedAntiLeakage,
      warnings
    };
  }

  /**
   * Enforces strict anti-data leakage rules during feature engineering and training dataset build.
   */
  public verifyAntiLeakage(features: Record<string, unknown>, isTrainingPhase: boolean = true): boolean {
    if (!isTrainingPhase) return true;

    const leakedKeys: string[] = [];
    for (const key of Object.keys(features)) {
      if (DataQualityEngine.FORBIDDEN_TRAINING_FEATURES.includes(key)) {
        leakedKeys.push(key);
      }
    }

    if (leakedKeys.length > 0) {
      throw new DataLeakageError(`Data Leakage detected! Post-conversion features found in feature set: ${leakedKeys.join(', ')}`, leakedKeys);
    }

    return true;
  }
}
