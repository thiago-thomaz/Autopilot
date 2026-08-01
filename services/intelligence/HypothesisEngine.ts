import { EvidenceRecord } from './EvidenceEngine';

export interface HypothesisRecord {
  id?: string;
  title: string;
  explanation: string;
  confidence: number;
  evidences: EvidenceRecord[];
}

export class HypothesisEngine {
  public formulateHypothesis(
    title: string,
    explanation: string,
    evidences: EvidenceRecord[]
  ): HypothesisRecord {
    const avgReliability = evidences.length > 0
      ? evidences.reduce((sum, e) => sum + e.reliabilityScore, 0) / evidences.length
      : 0.5;

    return {
      id: `hyp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      explanation,
      confidence: Number(avgReliability.toFixed(2)),
      evidences
    };
  }
}
