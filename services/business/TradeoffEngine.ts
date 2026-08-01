import { TradeoffAnalysisResult, TradeoffOption } from '../../types/business/strategy.types';

export class TradeoffEngine {
  public evaluateTradeoff(
    context: string,
    optionA: TradeoffOption,
    optionB: TradeoffOption
  ): TradeoffAnalysisResult {
    // Score = expectedProfitImpact / (1 + expectedRiskDelta)
    const scoreA = optionA.expectedProfitImpact / Math.max(0.1, 1 + optionA.expectedRiskDelta);
    const scoreB = optionB.expectedProfitImpact / Math.max(0.1, 1 + optionB.expectedRiskDelta);

    const recommendedOption = scoreA >= scoreB ? optionA : optionB;
    const alternativeOption = scoreA >= scoreB ? optionB : optionA;

    return {
      decisionContext: context,
      recommendedOption,
      alternativeOption,
      rationale: `Recommended '${recommendedOption.name}' as it yields higher risk-adjusted return ratio (${scoreA >= scoreB ? scoreA.toFixed(2) : scoreB.toFixed(2)}) compared to alternative (${(scoreA >= scoreB ? scoreB : scoreA).toFixed(2)}).`
    };
  }
}
