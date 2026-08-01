import { MetricSnapshot, DecisionPayload, DecisionType } from '../../types/automation/automation.types';

export class LanguageOptimizationEngine {
  evaluateLanguage(langCode: string, metrics: MetricSnapshot): DecisionPayload | null {
    if (metrics.conversionRate > 0.05 && metrics.conversions >= 5) {
      return {
        scope: 'LANGUAGE',
        entityType: 'Language',
        entityId: langCode,
        decisionType: DecisionType.CHANGE_LANGUAGE,
        reason: `Language ${langCode} has strong conversion rate (${(metrics.conversionRate * 100).toFixed(1)}%).`,
        confidence: 0.85,
        riskScore: 30,
        priority: 2,
      };
    }
    return null;
  }
}
