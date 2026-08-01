export interface PrioritizationInput {
  impact: number; // 1 to 10
  probability: number; // 0.1 to 1.0
  confidence: number; // 0.1 to 1.0
  strategicAlignment: number; // 1 to 10
  urgency: number; // 1 to 10
  scalability: number; // 1 to 10
  cost: number; // > 0
  risk: number; // > 0
}

export interface PrioritizationOutput {
  priorityScore: number;
  priorityLevel: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
}

export class PrioritizationEngine {
  /**
   * PriorityScore = (Impact * Probability * Confidence * StrategicAlignment * Urgency * Scalability) / (Cost * Risk)
   */
  public calculatePriority(input: PrioritizationInput): PrioritizationOutput {
    const { impact, probability, confidence, strategicAlignment, urgency, scalability, cost, risk } = input;

    const numerator = impact * probability * confidence * strategicAlignment * urgency * scalability;
    const denominator = Math.max(0.1, cost * risk);
    const rawScore = numerator / denominator;
    const priorityScore = Number(rawScore.toFixed(2));

    let priorityLevel: 'P0' | 'P1' | 'P2' | 'P3' | 'P4' = 'P3';
    if (priorityScore >= 100) {
      priorityLevel = 'P0';
    } else if (priorityScore >= 50) {
      priorityLevel = 'P1';
    } else if (priorityScore >= 20) {
      priorityLevel = 'P2';
    } else if (priorityScore >= 5) {
      priorityLevel = 'P3';
    } else {
      priorityLevel = 'P4';
    }

    return {
      priorityScore,
      priorityLevel
    };
  }
}
