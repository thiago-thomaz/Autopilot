export interface EvaluatedOutcome {
  decisionId: string;
  expectedNetProfit: number;
  actualNetProfit: number;
  variance: number; // actual - expected
  accuracyScore: number; // 0 to 1
  isSuccessful: boolean;
}

export class OutcomeEngine {
  public evaluateOutcome(decisionId: string, expectedNetProfit: number, actualNetProfit: number): EvaluatedOutcome {
    const variance = Number((actualNetProfit - expectedNetProfit).toFixed(4));
    const accuracyScore = expectedNetProfit !== 0
      ? Number(Math.max(0, 1 - Math.abs(variance) / Math.abs(expectedNetProfit)).toFixed(2))
      : 1.0;

    return {
      decisionId,
      expectedNetProfit: Number(expectedNetProfit.toFixed(4)),
      actualNetProfit: Number(actualNetProfit.toFixed(4)),
      variance,
      accuracyScore,
      isSuccessful: actualNetProfit >= expectedNetProfit * 0.8
    };
  }
}
