export interface CounterfactualOption {
  optionName: 'DO_NOTHING' | 'CURRENT_STRATEGY' | string;
  expectedNetProfit: number;
  expectedRiskScore: number;
}

export interface CounterfactualAnalysis {
  baselineOption: CounterfactualOption;
  candidateOption: CounterfactualOption;
  netProfitDelta: number;
  riskDelta: number;
  isCandidateBetter: boolean;
}

export class CounterfactualEngine {
  public evaluateCounterfactual(
    candidate: CounterfactualOption,
    doNothingProfit: number = 0,
    doNothingRisk: number = 20
  ): CounterfactualAnalysis {
    const baseline: CounterfactualOption = {
      optionName: 'DO_NOTHING',
      expectedNetProfit: doNothingProfit,
      expectedRiskScore: doNothingRisk
    };

    const netProfitDelta = Number((candidate.expectedNetProfit - baseline.expectedNetProfit).toFixed(4));
    const riskDelta = Number((candidate.expectedRiskScore - baseline.expectedRiskScore).toFixed(2));
    const isCandidateBetter = netProfitDelta > 0 && candidate.expectedRiskScore <= 70;

    return {
      baselineOption: baseline,
      candidateOption: candidate,
      netProfitDelta,
      riskDelta,
      isCandidateBetter
    };
  }
}
