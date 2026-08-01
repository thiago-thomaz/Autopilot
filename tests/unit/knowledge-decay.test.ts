import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeEngine } from '../../services/learning/KnowledgeEngine';

describe('Module 14 — Knowledge Decay & Versioning Engine', () => {
  let knowledgeEngine: KnowledgeEngine;

  beforeEach(() => {
    knowledgeEngine = new KnowledgeEngine();
  });

  it('KnowledgeEngine deve calcular decaimento de confiança temporal corretamente', () => {
    const item = knowledgeEngine.createKnowledge({
      knowledgeType: 'STRATEGY',
      title: 'Strategy test',
      description: 'Test description',
      confidence: 90.0,
      decayFactor: 0.05 // 5% per day
    });

    const confDay0 = knowledgeEngine.calculateDecay(item, 0);
    expect(confDay0).toBe(90.0);

    const confDay1 = knowledgeEngine.calculateDecay(item, 1);
    expect(confDay1).toBe(85.5); // 90 * 0.95 = 85.5

    const confDay10 = knowledgeEngine.calculateDecay(item, 10);
    expect(confDay10).toBeLessThan(60.0);
  });

  it('KnowledgeEngine deve manter histórico de versão imutável ao atualizar conhecimento', () => {
    const item = knowledgeEngine.createKnowledge({
      knowledgeType: 'RULE',
      title: 'Initial Rule',
      description: 'Initial description',
      confidence: 60.0
    });

    expect(item.version).toBe(1);
    const initialVersions = knowledgeEngine.getVersions(item.id);
    expect(initialVersions.length).toBe(1);

    const updated = knowledgeEngine.updateKnowledge(
      item.id,
      85.0,
      'Validated by 10 new high-ROI campaigns'
    );

    expect(updated.version).toBe(2);
    expect(updated.confidence).toBe(85.0);
    expect(updated.status).toBe('VALIDATED');

    const history = knowledgeEngine.getVersions(item.id);
    expect(history.length).toBe(2);
    expect(history[1].version).toBe(2);
    expect(history[1].previousConfidence).toBe(60.0);
    expect(history[1].newConfidence).toBe(85.0);
  });
});
