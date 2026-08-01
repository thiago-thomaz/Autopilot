import { LearningEvent, LearningEventInput } from '../../types/learning/learning.types';

export class LearningNormalizer {
  public normalize(input: LearningEventInput): LearningEvent {
    const timestamp = new Date();
    const id = input.id || `l_event_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Safely extract context and metrics
    const metrics: Record<string, any> = { ...input.metrics };
    const context: Record<string, any> = { ...input.context };

    // Standardize financial metrics to numbers with 4 decimal places if present
    for (const key of Object.keys(metrics)) {
      if (typeof metrics[key] === 'number') {
        metrics[key] = Number(metrics[key].toFixed(4));
      }
    }

    const confidenceScore = typeof input.confidenceScore === 'number' 
      ? Math.max(0, Math.min(1, Number(input.confidenceScore.toFixed(4))))
      : 0.5;

    const qualityScore = typeof input.qualityScore === 'number'
      ? Math.max(0, Math.min(1, Number(input.qualityScore.toFixed(4))))
      : 0.5;

    return {
      id,
      timestamp,
      source: input.source || 'UNKNOWN',
      entityType: input.entityType || 'GENERIC',
      entityId: input.entityId,
      decisionId: input.decisionId || null,
      campaignId: input.campaignId || null,
      experimentId: input.experimentId || null,
      market: input.market || null,
      country: input.country || null,
      language: input.language || null,
      channel: input.channel || null,
      metrics,
      context,
      confidenceScore,
      qualityScore,
      status: 'NEW',
      createdAt: timestamp
    };
  }
}
