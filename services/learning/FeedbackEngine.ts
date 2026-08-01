import { FeedbackInput } from '../../types/learning/learning.types';

export interface AggregatedFeedback {
  entityId: string;
  entityType: string;
  humanScoreAvg: number;
  agentScoreAvg: number;
  overallScore: number;
  totalFeedbacks: number;
  confidenceAdjustment: number;
}

export class FeedbackEngine {
  private feedbackRecords: FeedbackInput[] = [];

  public collectFeedback(input: FeedbackInput): FeedbackInput {
    // Normalize score to range [-1.0, 1.0]
    let normalizedScore = input.score;
    if (input.score > 1.0) {
      normalizedScore = (input.score - 50) / 50; // map 0..100 to -1..+1
    }
    normalizedScore = Math.max(-1.0, Math.min(1.0, Number(normalizedScore.toFixed(4))));

    const record: FeedbackInput = {
      ...input,
      score: normalizedScore
    };

    this.feedbackRecords.push(record);
    return record;
  }

  public getAggregatedFeedback(entityId: string): AggregatedFeedback {
    const records = this.feedbackRecords.filter(f => f.entityId === entityId);
    if (records.length === 0) {
      return {
        entityId,
        entityType: 'UNKNOWN',
        humanScoreAvg: 0,
        agentScoreAvg: 0,
        overallScore: 0,
        totalFeedbacks: 0,
        confidenceAdjustment: 0
      };
    }

    const humanRecords = records.filter(r => r.source === 'HUMAN');
    const agentRecords = records.filter(r => r.source === 'AGENT');

    const humanScoreAvg = humanRecords.length > 0
      ? humanRecords.reduce((acc, curr) => acc + curr.score, 0) / humanRecords.length
      : 0;

    const agentScoreAvg = agentRecords.length > 0
      ? agentRecords.reduce((acc, curr) => acc + curr.score, 0) / agentRecords.length
      : 0;

    // Human feedback has 60% weight, Agent feedback has 40% weight if both exist
    let overallScore = 0;
    if (humanRecords.length > 0 && agentRecords.length > 0) {
      overallScore = (humanScoreAvg * 0.6) + (agentScoreAvg * 0.4);
    } else if (humanRecords.length > 0) {
      overallScore = humanScoreAvg;
    } else {
      overallScore = agentScoreAvg;
    }

    overallScore = Number(overallScore.toFixed(4));
    const confidenceAdjustment = Number((overallScore * 0.15).toFixed(4)); // +/- 15% confidence shift

    return {
      entityId,
      entityType: records[0].entityType,
      humanScoreAvg: Number(humanScoreAvg.toFixed(4)),
      agentScoreAvg: Number(agentScoreAvg.toFixed(4)),
      overallScore,
      totalFeedbacks: records.length,
      confidenceAdjustment
    };
  }
}
