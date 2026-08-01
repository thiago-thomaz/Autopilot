export interface ExpectedValueOutput {
  expectedMonetaryValue: number;
  riskAdjustedValue: number;
  certaintyEquivalent: number;
}

export class ExpectedValueEngine {
  public calculateExpectedValue(
    outcomes: Array<{ probability: number; payout: number }>,
    confidenceScore: number = 0.8
  ): ExpectedValueOutput {
    let ev = 0;
    for (const outcome of outcomes) {
      ev += outcome.probability * outcome.payout;
    }

    // Risk-adjusted EV scaled by confidence
    const riskAdjustedValue = ev * confidenceScore;

    // Certainty equivalent (conservatively discounted EV)
    const certaintyEquivalent = ev * Math.pow(confidenceScore, 1.5);

    return {
      expectedMonetaryValue: Number(ev.toFixed(4)),
      riskAdjustedValue: Number(riskAdjustedValue.toFixed(4)),
      certaintyEquivalent: Number(certaintyEquivalent.toFixed(4))
    };
  }
}
