import { PredictionResult, PredictionExplanation as IPredictionExplanation } from '../../types/predictive/predictive.types';
import { FeatureVector } from '../../types/predictive/features.types';

export class PredictionExplanation {
  public generateExplanation(
    prediction: PredictionResult,
    featureVector: FeatureVector
  ): IPredictionExplanation {
    const positiveDrivers: Array<{ feature: string; weight: number; value: number }> = [];
    const negativeDrivers: Array<{ feature: string; weight: number; value: number }> = [];

    const price = Number(featureVector.features['price'] ?? 0);
    const ctr = Number(featureVector.features['ctr'] ?? 0);
    const commissionRate = Number(featureVector.features['commissionRate'] ?? 0);

    if (ctr > 0.02) {
      positiveDrivers.push({ feature: 'Click-Through Rate (CTR)', weight: 0.35, value: ctr });
    } else {
      negativeDrivers.push({ feature: 'Click-Through Rate (CTR)', weight: -0.20, value: ctr });
    }

    if (commissionRate >= 0.05) {
      positiveDrivers.push({ feature: 'Commission Rate', weight: 0.40, value: commissionRate });
    } else {
      negativeDrivers.push({ feature: 'Low Commission Rate', weight: -0.15, value: commissionRate });
    }

    if (price > 0 && price <= 100) {
      positiveDrivers.push({ feature: 'Optimal Price Point', weight: 0.25, value: price });
    } else if (price > 300) {
      negativeDrivers.push({ feature: 'High Price Friction', weight: -0.30, value: price });
    }

    return {
      predictionId: prediction.id || `pred-${Date.now()}`,
      target: prediction.predictionType,
      predictedValue: prediction.predictedValue,
      lowerBound: prediction.lowerBound,
      upperBound: prediction.upperBound,
      confidenceScore: prediction.confidenceScore,
      positiveDrivers,
      negativeDrivers,
      dataSources: ['Historical Clicks', 'Commission Structure', 'Category Priors']
    };
  }
}
