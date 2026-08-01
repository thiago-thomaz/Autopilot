import { 
  DiscoveredKnowledge, 
  DiscoveredKnowledgeInput, 
  KnowledgeVersion,
  KnowledgeType 
} from '../../types/learning/learning.types';

export class KnowledgeEngine {
  private knowledgeMap: Map<string, DiscoveredKnowledge> = new Map();
  private versionMap: Map<string, KnowledgeVersion[]> = new Map();

  public createKnowledge(input: DiscoveredKnowledgeInput): DiscoveredKnowledge {
    const id = input.id || `kn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const item: DiscoveredKnowledge = {
      id,
      knowledgeType: input.knowledgeType,
      title: input.title,
      description: input.description,
      confidence: input.confidence ?? 50.0,
      confidenceInterval: input.confidenceInterval || { lower: (input.confidence ?? 50) - 5, upper: (input.confidence ?? 50) + 5 },
      importance: input.importance ?? 50.0,
      quality: 0.8,
      reliability: 0.85,
      sampleSize: input.sampleSize ?? 1,
      decayFactor: input.decayFactor ?? 0.01,
      evidence: input.evidence || {},
      market: input.market || null,
      country: input.country || null,
      language: input.language || null,
      channel: input.channel || null,
      version: 1,
      status: 'NEW',
      validFrom: input.validFrom || now,
      validUntil: input.validUntil || null,
      createdAt: now,
      updatedAt: now
    };

    this.knowledgeMap.set(id, item);

    // Initial version entry
    const initialVersion: KnowledgeVersion = {
      id: `ver_${id}_v1`,
      knowledgeId: id,
      version: 1,
      delta: { action: 'CREATED', initialConfidence: item.confidence },
      previousConfidence: 0,
      newConfidence: item.confidence,
      reason: 'Initial Knowledge Discovery',
      createdAt: now
    };

    this.versionMap.set(id, [initialVersion]);
    return item;
  }

  public updateKnowledge(
    knowledgeId: string, 
    newConfidence: number, 
    reason: string, 
    additionalEvidence?: Record<string, any>
  ): DiscoveredKnowledge {
    const item = this.knowledgeMap.get(knowledgeId);
    if (!item) throw new Error(`Knowledge item not found: ${knowledgeId}`);

    const previousConfidence = item.confidence;
    const nextVersionNum = item.version + 1;
    const now = new Date().toISOString();

    item.confidence = Number(newConfidence.toFixed(4));
    item.version = nextVersionNum;
    item.updatedAt = now;
    if (additionalEvidence) {
      item.evidence = { ...item.evidence, ...additionalEvidence };
    }

    if (item.confidence >= 70 && item.status === 'NEW') {
      item.status = 'VALIDATED';
    } else if (item.confidence < 30) {
      item.status = 'REJECTED';
    }

    const versionRecord: KnowledgeVersion = {
      id: `ver_${knowledgeId}_v${nextVersionNum}`,
      knowledgeId,
      version: nextVersionNum,
      delta: { reason, additionalEvidence },
      previousConfidence,
      newConfidence: item.confidence,
      reason,
      createdAt: now
    };

    const history = this.versionMap.get(knowledgeId) || [];
    history.push(versionRecord);
    this.versionMap.set(knowledgeId, history);

    return item;
  }

  public calculateDecay(item: DiscoveredKnowledge, daysElapsed: number): number {
    if (daysElapsed <= 0) return item.confidence;
    
    // Formula: Confidence * (1 - decayFactor) ^ daysElapsed
    const decayed = item.confidence * Math.pow(1 - item.decayFactor, daysElapsed);
    return Number(Math.max(0, decayed).toFixed(4));
  }

  public applyDecayAll(daysElapsed: number): DiscoveredKnowledge[] {
    const updated: DiscoveredKnowledge[] = [];
    this.knowledgeMap.forEach((item) => {
      const newConf = this.calculateDecay(item, daysElapsed);
      if (newConf !== item.confidence) {
        this.updateKnowledge(item.id, newConf, `Temporal decay applied (${daysElapsed} days)`);
        updated.push(item);
      }
    });
    return updated;
  }

  public getKnowledge(id: string): DiscoveredKnowledge | undefined {
    return this.knowledgeMap.get(id);
  }

  public getVersions(knowledgeId: string): KnowledgeVersion[] {
    return this.versionMap.get(knowledgeId) || [];
  }

  public queryKnowledge(filter: {
    knowledgeType?: KnowledgeType;
    country?: string;
    status?: string;
    minConfidence?: number;
  }): DiscoveredKnowledge[] {
    return Array.from(this.knowledgeMap.values()).filter((item) => {
      if (filter.knowledgeType && item.knowledgeType !== filter.knowledgeType) return false;
      if (filter.country && item.country !== filter.country) return false;
      if (filter.status && item.status !== filter.status) return false;
      if (filter.minConfidence && item.confidence < filter.minConfidence) return false;
      return true;
    });
  }
}
