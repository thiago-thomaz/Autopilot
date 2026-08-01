export interface StrategicInitiative {
  id: string;
  name: string;
  expectedProfitImpact: number;
  riskScore: number;
  priorityScore?: number;
}

export class StrategicPriorityEngine {
  public rankInitiatives(initiatives: StrategicInitiative[]): StrategicInitiative[] {
    return initiatives
      .map((i) => ({
        ...i,
        priorityScore: Number((i.expectedProfitImpact / Math.max(1, i.riskScore)).toFixed(2))
      }))
      .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
  }
}
