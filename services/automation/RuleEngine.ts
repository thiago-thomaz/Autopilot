import { MetricSnapshot, DecisionPayload, DecisionType } from '../../types/automation/automation.types';

export interface DeterministicRule {
  id: string;
  ruleCode: string;
  name: string;
  evaluate: (metrics: MetricSnapshot) => DecisionPayload | null;
}

export class RuleEngine {
  private rules: DeterministicRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  registerRule(rule: DeterministicRule) {
    this.rules.push(rule);
  }

  private registerDefaultRules() {
    // Rule 1: Scale Winners (High ROI & Profit)
    this.registerRule({
      id: 'RULE_SCALE_WINNER',
      ruleCode: 'SCALE_WINNER',
      name: 'Scale High Performing Offer/Campaign',
      evaluate: (metrics: MetricSnapshot): DecisionPayload | null => {
        if (metrics.roi >= 1.5 && metrics.profit > 50 && metrics.conversions >= 5) {
          return {
            scope: 'PRODUCT',
            entityType: 'Product',
            entityId: 'product-id',
            decisionType: DecisionType.SCALE_WINNER,
            reason: `High performance detected: ROI ${metrics.roi.toFixed(2)}x and profit $${metrics.profit.toFixed(2)}.`,
            confidence: 0.95,
            expectedImpact: { profitDelta: metrics.profit * 0.2, roiDelta: 0.1 },
            riskScore: 65,
            priority: 1,
          };
        }
        return null;
      },
    });

    // Rule 2: Stop Unprofitable Offers
    this.registerRule({
      id: 'RULE_STOP_UNPROFITABLE',
      ruleCode: 'STOP_UNPROFITABLE',
      name: 'Pause Unprofitable Product or Campaign',
      evaluate: (metrics: MetricSnapshot): DecisionPayload | null => {
        if (metrics.spend >= 30 && metrics.conversions === 0 && metrics.clicks >= 50) {
          return {
            scope: 'PRODUCT',
            entityType: 'Product',
            entityId: 'product-id',
            decisionType: DecisionType.STOP_UNPROFITABLE,
            reason: `Unprofitable campaign: $${metrics.spend.toFixed(2)} spent with 0 conversions across ${metrics.clicks} clicks.`,
            confidence: 0.98,
            expectedImpact: { profitDelta: metrics.spend },
            riskScore: 15,
            priority: 0,
          };
        }
        return null;
      },
    });

    // Rule 3: Content Fatigue / Decay
    this.registerRule({
      id: 'RULE_CONTENT_DECAY',
      ruleCode: 'RECREATE_CONTENT',
      name: 'Refresh Decaying Content Variant',
      evaluate: (metrics: MetricSnapshot): DecisionPayload | null => {
        if (metrics.impressions > 1000 && metrics.clicks > 10 && metrics.conversionRate < 0.01) {
          return {
            scope: 'PRODUCT',
            entityType: 'Content',
            entityId: 'content-id',
            decisionType: DecisionType.RECREATE_CONTENT,
            reason: `Low conversion rate (${(metrics.conversionRate * 100).toFixed(2)}%) indicates content fatigue.`,
            confidence: 0.85,
            expectedImpact: { conversionDelta: 0.02 },
            riskScore: 30,
            priority: 2,
          };
        }
        return null;
      },
    });
  }

  evaluateMetrics(metrics: MetricSnapshot): DecisionPayload[] {
    const candidateDecisions: DecisionPayload[] = [];
    for (const rule of this.rules) {
      const decision = rule.evaluate(metrics);
      if (decision) {
        candidateDecisions.push(decision);
      }
    }
    return candidateDecisions;
  }
}
