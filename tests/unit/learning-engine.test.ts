import { describe, it, expect, beforeEach } from 'vitest';
import { 
  LearningEngine, 
  LearningNormalizer, 
  LearningValidator, 
  RewardEngine, 
  FeedbackEngine,
  KnowledgePublisher
} from '../../services/learning';

describe('Module 14 — Core Learning Engine & Pipeline', () => {
  let learningEngine: LearningEngine;

  beforeEach(() => {
    learningEngine = new LearningEngine();
  });

  it('LearningNormalizer deve normalizar eventos e formatar métricas financeiras com 4 casas decimais', () => {
    const normalizer = new LearningNormalizer();
    const event = normalizer.normalize({
      source: 'M11_CAMPAIGN',
      entityType: 'CAMPAIGN',
      entityId: 'camp_123',
      metrics: {
        actualNetProfit: 154.345678,
        actualROI: 2.123456
      },
      confidenceScore: 0.85
    });

    expect(event.id).toBeDefined();
    expect(event.metrics.actualNetProfit).toBe(154.3457);
    expect(event.metrics.actualROI).toBe(2.1235);
    expect(event.confidenceScore).toBe(0.85);
  });

  it('LearningValidator deve detectar duplicatas e validar integridade do schema', () => {
    const validator = new LearningValidator();
    const event = new LearningNormalizer().normalize({
      id: 'event_fixed_1',
      source: 'M13_DECISION',
      entityType: 'DECISION',
      entityId: 'dec_1',
      metrics: { expectedNetProfit: 100 }
    });

    const res1 = validator.validate(event);
    expect(res1.isValid).toBe(true);

    const res2 = validator.validate(event);
    expect(res2.isValid).toBe(false);
    expect(res2.errors[0]).toContain('Duplicate event ID');
  });

  it('RewardEngine deve calcular o sinal de reforço estritamente entre -1.0 e +1.0', () => {
    const rewardEngine = new RewardEngine();
    
    // Positive Outcome
    const posReward = rewardEngine.calculateReward('dec_1', 'camp_1', 'CAMPAIGN', 500, 300, 2.5, 1.8);
    expect(posReward.isPositive).toBe(true);
    expect(posReward.rewardValue).toBeGreaterThan(0);
    expect(posReward.rewardValue).toBeLessThanOrEqual(1.0);

    // Negative Outcome
    const negReward = rewardEngine.calculateReward('dec_2', 'camp_2', 'CAMPAIGN', -100, 200, 0.5, 2.0);
    expect(negReward.isPositive).toBe(false);
    expect(negReward.rewardValue).toBeLessThan(0);
    expect(negReward.rewardValue).toBeGreaterThanOrEqual(-1.0);
  });

  it('FeedbackEngine deve ponderar feedback humano (60%) e de agentes (40%)', () => {
    const feedbackEngine = new FeedbackEngine();
    
    feedbackEngine.collectFeedback({
      source: 'HUMAN',
      entityId: 'item_1',
      entityType: 'PLAYBOOK',
      score: 100 // maps to +1.0
    });

    feedbackEngine.collectFeedback({
      source: 'AGENT',
      entityId: 'item_1',
      entityType: 'PLAYBOOK',
      score: 50 // maps to 0.0
    });

    const agg = feedbackEngine.getAggregatedFeedback('item_1');
    expect(agg.humanScoreAvg).toBe(1.0);
    expect(agg.agentScoreAvg).toBe(0.0);
    expect(agg.overallScore).toBe(0.6); // 1.0 * 0.6 + 0.0 * 0.4
  });

  it('KnowledgePublisher deve emitir eventos no EventBus', () => {
    const publisher = new KnowledgePublisher();
    let emitted = false;

    publisher.subscribe('learning.event.received', (type, payload) => {
      emitted = true;
      expect(type).toBe('learning.event.received');
      expect(payload.event.id).toBe('event_test');
    });

    publisher.publishLearningEventReceived({
      id: 'event_test',
      timestamp: new Date(),
      source: 'TEST',
      entityType: 'TEST',
      entityId: 't1',
      metrics: {},
      context: {},
      confidenceScore: 0.9,
      qualityScore: 0.9,
      status: 'VALIDATED',
      createdAt: new Date()
    });

    expect(emitted).toBe(true);
  });
});
