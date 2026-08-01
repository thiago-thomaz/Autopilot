import { PredictionExplanation } from '../../types/predictive/predictive.types';

export class LLMInsightEngine {
  /**
   * Generates textual reasoning summary for quantitative prediction inputs
   */
  public async generateQualitativeInsight(explanation: PredictionExplanation): Promise<string> {
    const positives = explanation.positiveDrivers.map(d => d.feature).join(', ');
    const negatives = explanation.negativeDrivers.map(d => d.feature).join(', ');

    return `PREDICTIVE REASONING SUMMARY:
Target Metric: ${explanation.target}
Predicted Value: ${explanation.predictedValue} (Interval: ${explanation.lowerBound} to ${explanation.upperBound})
Confidence Score: ${Math.round(explanation.confidenceScore * 100)}%

Key Drivers:
- Positive Factors: ${positives || 'Standard historical average baseline'}
- Risk / Negative Factors: ${negatives || 'None identified'}

Hypothesis: Conversion rate stability is strongly anchored by competitive commission structures and channel engagement history. Yield is non-guaranteed.`;
  }
}
