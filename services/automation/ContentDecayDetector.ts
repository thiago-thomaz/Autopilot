import { DecisionPayload, DecisionType, MetricSnapshot } from '../../types/automation/automation.types';

export class ContentDecayDetector {
  detectDecay(contentId: string, historicalCtr: number, currentMetrics: MetricSnapshot): DecisionPayload | null {
    const currentCtr = currentMetrics.impressions > 0 ? currentMetrics.clicks / currentMetrics.impressions : 0;
    if (historicalCtr > 0 && currentCtr / historicalCtr < 0.5) {
      return {
        scope: 'PRODUCT',
        entityType: 'Content',
        entityId: contentId,
        decisionType: DecisionType.RECREATE_CONTENT,
        reason: `Content fatigue detected. CTR dropped by >50% (Historical: ${(historicalCtr * 100).toFixed(2)}%, Current: ${(currentCtr * 100).toFixed(2)}%).`,
        confidence: 0.88,
        riskScore: 30,
        priority: 2,
      };
    }
    return null;
  }
}
