import { OpportunityClassification, OpportunityPriority } from '@prisma/client';

export class OpportunityClassificationService {
  /**
   * Mapeia o Opportunity Score em faixas de classificação e prioridades operacionais (P0 a P4).
   *
   * Regras:
   * 90–100: EXCEPTIONAL (Prioridade P0)
   * 80–89:  HIGH (Prioridade P1)
   * 70–79:  GOOD (Prioridade P2)
   * 60–69:  MODERATE (Prioridade P3)
   * 40–59:  LOW (Prioridade P4)
   * 0–39:   VERY_LOW (Prioridade P4)
   */
  public static classify(score: number): { classification: OpportunityClassification; priority: OpportunityPriority } {
    if (score >= 90) return { classification: 'EXCEPTIONAL', priority: 'P0' };
    if (score >= 80) return { classification: 'HIGH', priority: 'P1' };
    if (score >= 70) return { classification: 'GOOD', priority: 'P2' };
    if (score >= 60) return { classification: 'MODERATE', priority: 'P3' };
    if (score >= 40) return { classification: 'LOW', priority: 'P4' };
    return { classification: 'VERY_LOW', priority: 'P4' };
  }
}
