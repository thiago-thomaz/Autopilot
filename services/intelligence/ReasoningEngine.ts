import { HypothesisRecord } from './HypothesisEngine';

export interface ReasoningResult {
  topHypothesis: HypothesisRecord;
  alternativeHypothesis?: HypothesisRecord;
  causalChain: string[];
  recommendedStrategy: string;
}

export class ReasoningEngine {
  public deduceCause(hypotheses: HypothesisRecord[]): ReasoningResult {
    const sorted = [...hypotheses].sort((a, b) => b.confidence - a.confidence);
    const top = sorted[0] || {
      title: 'Unknown Fluctuation',
      explanation: 'Insufficient evidence to form a conclusive hypothesis.',
      confidence: 0.3,
      evidences: []
    };

    return {
      topHypothesis: top,
      alternativeHypothesis: sorted[1],
      causalChain: [
        `Observed signal discrepancy`,
        `Evaluated ${hypotheses.length} candidate hypotheses`,
        `Identified '${top.title}' as primary cause with ${(top.confidence * 100).toFixed(1)}% confidence`
      ],
      recommendedStrategy: `Address '${top.title}' via targeted action plan.`
    };
  }
}
