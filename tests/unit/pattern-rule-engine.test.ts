import { describe, it, expect } from 'vitest';
import { PatternEngine, RuleEngine, LearningNormalizer } from '../../services/learning';

describe('Module 14 — Pattern Discovery & Rule Extraction Engine', () => {
  const normalizer = new LearningNormalizer();

  it('PatternEngine deve descobrir padrões estatísticos e calcular o ganho relativo (lift ratio)', () => {
    const patternEngine = new PatternEngine();

    const events = [
      normalizer.normalize({ source: 'M11', entityType: 'CAMPAIGN', entityId: 'c1', country: 'US', channel: 'TIKTOK', metrics: { roi: 3.5 } }),
      normalizer.normalize({ source: 'M11', entityType: 'CAMPAIGN', entityId: 'c2', country: 'US', channel: 'TIKTOK', metrics: { roi: 3.8 } }),
      normalizer.normalize({ source: 'M11', entityType: 'CAMPAIGN', entityId: 'c3', country: 'BR', channel: 'FACEBOOK', metrics: { roi: 1.0 } }),
      normalizer.normalize({ source: 'M11', entityType: 'CAMPAIGN', entityId: 'c4', country: 'BR', channel: 'FACEBOOK', metrics: { roi: 0.9 } })
    ];

    const patterns = patternEngine.discoverPatterns(events);
    expect(patterns.length).toBeGreaterThan(0);
    
    const usTiktokPattern = patterns.find(p => p.name.includes('US/TIKTOK'));
    expect(usTiktokPattern).toBeDefined();
    expect(usTiktokPattern!.performanceLiftRatio).toBeGreaterThan(1.15);
  });

  it('RuleEngine deve extrair regras determinísticas e invalidar quando a evidência contrária superar o limite', () => {
    const ruleEngine = new RuleEngine();

    const events = [
      normalizer.normalize({ source: 'M11', entityType: 'CAMPAIGN', entityId: 'c1', country: 'US', channel: 'TIKTOK', metrics: { isSuccessful: true, roi: 2.0 } }),
      normalizer.normalize({ source: 'M11', entityType: 'CAMPAIGN', entityId: 'c2', country: 'US', channel: 'TIKTOK', metrics: { isSuccessful: true, roi: 2.1 } }),
      normalizer.normalize({ source: 'M11', entityType: 'CAMPAIGN', entityId: 'c3', country: 'US', channel: 'TIKTOK', metrics: { isSuccessful: true, roi: 1.9 } })
    ];

    const rules = ruleEngine.extractRulesFromEvents(events);
    expect(rules.length).toBe(1);
    expect(rules[0].confidence).toBe(100.0);
    expect(rules[0].status).toBe('ACTIVE');

    // Simulate negative outcomes to test rule invalidation
    ruleEngine.evaluateRuleAgainstOutcome(rules[0].ruleId, false);
    ruleEngine.evaluateRuleAgainstOutcome(rules[0].ruleId, false);
    ruleEngine.evaluateRuleAgainstOutcome(rules[0].ruleId, false);
    ruleEngine.evaluateRuleAgainstOutcome(rules[0].ruleId, false);

    const evaluated = ruleEngine.evaluateRuleAgainstOutcome(rules[0].ruleId, false);
    expect(evaluated!.isValid).toBe(false);
    expect(ruleEngine.getActiveRules().length).toBe(0);
  });
});
