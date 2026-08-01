import { MetricSnapshot, DecisionPayload, DecisionType } from '../../types/automation/automation.types';

export class ProductOptimizationEngine {
  evaluateProduct(productId: string, metrics: MetricSnapshot): DecisionPayload | null {
    if (metrics.roi >= 1.5 && metrics.conversions >= 5) {
      return {
        scope: 'PRODUCT',
        entityType: 'Product',
        entityId: productId,
        decisionType: DecisionType.SCALE_WINNER,
        reason: `Product ${productId} exceeds high ROI target (${metrics.roi.toFixed(2)}x).`,
        confidence: 0.9,
        riskScore: 60,
        priority: 1,
      };
    }
    if (metrics.spend > 40 && metrics.conversions === 0) {
      return {
        scope: 'PRODUCT',
        entityType: 'Product',
        entityId: productId,
        decisionType: DecisionType.STOP_UNPROFITABLE,
        reason: `Product ${productId} has 0 conversions with $${metrics.spend} spend.`,
        confidence: 0.95,
        riskScore: 15,
        priority: 0,
      };
    }
    return null;
  }
}
