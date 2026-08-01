import { RiskEvaluationItem } from '../../types/intelligence/intelligence.types';

export class RiskDetectionEngine {
  public evaluateRisk(
    category: string,
    description: string,
    probability: number,
    impact: number
  ): RiskEvaluationItem {
    const score = Number((probability * impact * 100).toFixed(2));
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';

    if (score >= 75) {
      severity = 'CRITICAL';
    } else if (score >= 50) {
      severity = 'HIGH';
    } else if (score >= 25) {
      severity = 'MEDIUM';
    } else {
      severity = 'LOW';
    }

    let mitigationAction = 'Maintain standard monitoring and decision guardrails.';
    if (severity === 'CRITICAL') {
      mitigationAction = 'HALT AUTONOMOUS SPEND: Trigger CASH_SAFETY_LOCK and escalate to human operator.';
    } else if (severity === 'HIGH') {
      mitigationAction = 'REDUCE ALLOCATION: Require L3 human approval before scaling.';
    }

    return {
      category,
      description,
      severity,
      probability: Number(probability.toFixed(2)),
      impact: Number(impact.toFixed(2)),
      score,
      mitigationAction
    };
  }
}
