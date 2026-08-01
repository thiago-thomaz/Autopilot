import { describe, it, expect } from 'vitest';
import { OpportunityClassificationService } from '../../services/opportunity/OpportunityClassificationService';

describe('OpportunityClassificationService (Faixas & Prioridades)', () => {
  it('deve classificar score >= 90 como EXCEPTIONAL com prioridade P0', () => {
    const res = OpportunityClassificationService.classify(95);
    expect(res.classification).toBe('EXCEPTIONAL');
    expect(res.priority).toBe('P0');
  });

  it('deve classificar score 80-89 como HIGH com prioridade P1', () => {
    const res = OpportunityClassificationService.classify(85);
    expect(res.classification).toBe('HIGH');
    expect(res.priority).toBe('P1');
  });

  it('deve classificar score 70-79 como GOOD com prioridade P2', () => {
    const res = OpportunityClassificationService.classify(75);
    expect(res.classification).toBe('GOOD');
    expect(res.priority).toBe('P2');
  });

  it('deve classificar score < 40 como VERY_LOW com prioridade P4', () => {
    const res = OpportunityClassificationService.classify(25);
    expect(res.classification).toBe('VERY_LOW');
    expect(res.priority).toBe('P4');
  });
});
