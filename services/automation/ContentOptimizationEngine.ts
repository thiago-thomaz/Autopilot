import { DecisionPayload, DecisionType, MetricSnapshot } from '../../types/automation/automation.types';

export class ContentOptimizationEngine {
  optimizeContent(contentId: string, metrics: MetricSnapshot): DecisionPayload | null {
    if (metrics.impressions > 2000 && metrics.clicks < 20) {
      return {
        scope: 'PRODUCT',
        entityType: 'Content',
        entityId: contentId,
        decisionType: DecisionType.CHANGE_CONTENT_VARIANT,
        reason: `Low CTR detected on content ${contentId} (${((metrics.clicks / metrics.impressions) * 100).toFixed(2)}%). Testing new headline/thumbnail variant.`,
        confidence: 0.8,
        riskScore: 25,
        priority: 2,
      };
    }
    return null;
  }
}
