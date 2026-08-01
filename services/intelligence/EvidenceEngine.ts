import { EvidenceConfidenceType } from '@prisma/client';

export interface EvidenceRecord {
  id?: string;
  evidenceType: EvidenceConfidenceType;
  description: string;
  source: string;
  reliabilityScore: number;
  payload?: any;
}

export class EvidenceEngine {
  public classifyEvidence(
    description: string,
    source: string,
    type: EvidenceConfidenceType = 'DIRECT',
    reliabilityScore: number = 0.85
  ): EvidenceRecord {
    return {
      id: `evd_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      evidenceType: type,
      description,
      source,
      reliabilityScore: Number(reliabilityScore.toFixed(2))
    };
  }
}
