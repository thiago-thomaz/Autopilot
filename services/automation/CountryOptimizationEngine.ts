import { MetricSnapshot, DecisionPayload, DecisionType } from '../../types/automation/automation.types';

export class CountryOptimizationEngine {
  evaluateCountry(countryCode: string, metrics: MetricSnapshot): DecisionPayload | null {
    if (metrics.roi > 2.0 && metrics.conversions >= 10) {
      return {
        scope: 'COUNTRY',
        entityType: 'Country',
        entityId: countryCode,
        decisionType: DecisionType.INCREASE_DISTRIBUTION,
        reason: `Country ${countryCode} shows high conversion potential (ROI ${metrics.roi.toFixed(2)}x).`,
        confidence: 0.9,
        riskScore: 50,
        priority: 1,
      };
    }
    return null;
  }
}
