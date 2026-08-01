import { LearningEvent, RuleExtractionResult } from '../../types/learning/learning.types';

export interface ExtractedRule {
  ruleId: string;
  condition: Record<string, any>;
  actionRecommendation: string;
  confidence: number;
  sampleSize: number;
  supportingCount: number;
  contradictingCount: number;
  status: 'ACTIVE' | 'INVALIDATED' | 'DEPRECATED';
  createdAt: Date | string;
}

export class RuleEngine {
  private activeRules: Map<string, ExtractedRule> = new Map();

  public extractRulesFromEvents(events: LearningEvent[]): ExtractedRule[] {
    const newRules: ExtractedRule[] = [];

    // Group events by country and channel to derive deterministic rules
    const groups: Map<string, LearningEvent[]> = new Map();
    for (const e of events) {
      const key = `country:${e.country || 'GLOBAL'}|channel:${e.channel || 'ALL'}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(e);
    }

    groups.forEach((groupEvents, key) => {
      if (groupEvents.length < 3) return;

      const successfulCount = groupEvents.filter(e => e.metrics.isSuccessful === true || e.metrics.roi >= 1.2).length;
      const failedCount = groupEvents.length - successfulCount;

      const confidence = Number(((successfulCount / groupEvents.length) * 100).toFixed(2));
      const [countryPart, channelPart] = key.split('|');

      const ruleId = `rule_${countryPart}_${channelPart}_${Date.now()}`;
      const rule: ExtractedRule = {
        ruleId,
        condition: {
          country: countryPart.split(':')[1],
          channel: channelPart.split(':')[1]
        },
        actionRecommendation: confidence >= 70 ? 'INCREASE_BUDGET' : 'DECREASE_BUDGET',
        confidence,
        sampleSize: groupEvents.length,
        supportingCount: successfulCount,
        contradictingCount: failedCount,
        status: confidence >= 50 ? 'ACTIVE' : 'INVALIDATED',
        createdAt: new Date().toISOString()
      };

      this.activeRules.set(ruleId, rule);
      newRules.push(rule);
    });

    return newRules;
  }

  public evaluateRuleAgainstOutcome(ruleId: string, isOutcomePositive: boolean): RuleExtractionResult | null {
    const rule = this.activeRules.get(ruleId);
    if (!rule) return null;

    if (isOutcomePositive) {
      rule.supportingCount += 1;
    } else {
      rule.contradictingCount += 1;
    }

    const total = rule.supportingCount + rule.contradictingCount;
    rule.confidence = Number(((rule.supportingCount / total) * 100).toFixed(2));

    // Invalidation condition: if contradicting evidence > supporting evidence or confidence drops < 40%
    if (rule.confidence < 40.0 || rule.contradictingCount > rule.supportingCount * 1.5) {
      rule.status = 'INVALIDATED';
    }

    return {
      ruleId: rule.ruleId,
      condition: JSON.stringify(rule.condition),
      actionRecommendation: rule.actionRecommendation,
      confidence: rule.confidence,
      isValid: rule.status === 'ACTIVE',
      contradictingEvidenceCount: rule.contradictingCount,
      supportingEvidenceCount: rule.supportingCount
    };
  }

  public getActiveRules(): ExtractedRule[] {
    return Array.from(this.activeRules.values()).filter(r => r.status === 'ACTIVE');
  }
}
