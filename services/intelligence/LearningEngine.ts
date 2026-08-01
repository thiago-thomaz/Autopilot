import { EvaluatedOutcome } from './OutcomeEngine';

export interface LearningResult {
  decisionId: string;
  lessonLearned: string;
  confidenceDelta: number; // e.g. +0.05 or -0.10
  suggestedWeightAdjustments: Record<string, number>;
}

export class LearningEngine {
  public processLearning(outcome: EvaluatedOutcome): LearningResult {
    let confidenceDelta = 0.05;
    let lessonLearned = `Decision ${outcome.decisionId} achieved prediction accuracy of ${(outcome.accuracyScore * 100).toFixed(1)}%.`;

    if (!outcome.isSuccessful) {
      confidenceDelta = -0.10;
      lessonLearned = `Decision ${outcome.decisionId} underperformed prediction by $${Math.abs(outcome.variance).toFixed(2)}. Adjusting agent weights.`;
    }

    return {
      decisionId: outcome.decisionId,
      lessonLearned,
      confidenceDelta,
      suggestedWeightAdjustments: {
        FINANCIAL_INTELLIGENCE: outcome.isSuccessful ? 1.05 : 0.95,
        RISK_COMPLIANCE: 1.0
      }
    };
  }
}
