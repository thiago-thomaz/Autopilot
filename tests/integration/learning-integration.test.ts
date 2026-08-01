import { describe, it, expect } from 'vitest';
import { LearningEngine } from '../../services/learning';

describe('Module 14 — Continuous Learning Integration E2E Pipeline', () => {
  it('deve processar o ciclo completo: Ingestão -> Validação -> Recompensa -> Padrões -> Regras -> Calibração -> Publicador', () => {
    const learningEngine = new LearningEngine();
    let publishedKnowledgeCount = 0;
    let publishedCalibrationCount = 0;

    learningEngine.publisher.subscribe('knowledge.published', () => {
      publishedKnowledgeCount++;
    });

    learningEngine.publisher.subscribe('model.calibrated', () => {
      publishedCalibrationCount++;
    });

    // Ingest outcome events from M11, M12, M13 across groups
    // Group 1: US TIKTOK (High performer, 3 events)
    learningEngine.ingestEvent({
      source: 'M11_GROWTH',
      entityType: 'CAMPAIGN',
      entityId: 'camp_us_1',
      decisionId: 'dec_101',
      country: 'US',
      channel: 'TIKTOK',
      metrics: {
        actualNetProfit: 250.50,
        expectedNetProfit: 200.00,
        actualROI: 2.25,
        expectedROI: 1.80,
        isSuccessful: true,
        roi: 2.25
      },
      priority: 'HIGH'
    });

    learningEngine.ingestEvent({
      source: 'M11_GROWTH',
      entityType: 'CAMPAIGN',
      entityId: 'camp_us_2',
      decisionId: 'dec_102',
      country: 'US',
      channel: 'TIKTOK',
      metrics: {
        actualNetProfit: 310.00,
        expectedNetProfit: 220.00,
        actualROI: 2.50,
        expectedROI: 1.90,
        isSuccessful: true,
        roi: 2.50
      },
      priority: 'HIGH'
    });

    learningEngine.ingestEvent({
      source: 'M11_GROWTH',
      entityType: 'CAMPAIGN',
      entityId: 'camp_us_3',
      decisionId: 'dec_103',
      country: 'US',
      channel: 'TIKTOK',
      metrics: {
        actualNetProfit: 280.00,
        expectedNetProfit: 210.00,
        actualROI: 2.40,
        expectedROI: 1.85,
        isSuccessful: true,
        roi: 2.40
      },
      priority: 'HIGH'
    });

    // Group 2: Control baseline event (BR Facebook, low ROI)
    learningEngine.ingestEvent({
      source: 'M11_GROWTH',
      entityType: 'CAMPAIGN',
      entityId: 'camp_br_1',
      decisionId: 'dec_104',
      country: 'BR',
      channel: 'FACEBOOK',
      metrics: {
        actualNetProfit: 50.00,
        expectedNetProfit: 100.00,
        actualROI: 1.00,
        expectedROI: 1.50,
        isSuccessful: false,
        roi: 1.00
      },
      priority: 'MEDIUM'
    });

    // Trigger full learning cycle
    const summary = learningEngine.processLearningCycle();

    expect(summary.eventsProcessed).toBe(4);
    expect(summary.rewardsCalculated).toBe(4);
    expect(summary.knowledgeDiscovered).toBeGreaterThan(0);
    expect(publishedKnowledgeCount).toBe(summary.knowledgeDiscovered);
    expect(publishedCalibrationCount).toBe(summary.calibrationsPerformed);

    const activeRules = learningEngine.ruleEngine.getActiveRules();
    expect(activeRules.length).toBeGreaterThan(0);

    const calibrations = learningEngine.modelRegistry.getCalibrationHistory();
    expect(calibrations.length).toBe(summary.calibrationsPerformed);
  });
});
