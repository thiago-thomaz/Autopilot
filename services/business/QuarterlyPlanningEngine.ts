export interface QuarterlyOKR {
  quarter: string; // e.g. Q3 2026
  objective: string;
  keyResults: { metric: string; target: number; current: number }[];
}

export class QuarterlyPlanningEngine {
  public planQuarter(quarter: string, objective: string, keyResults: { metric: string; target: number }[]): QuarterlyOKR {
    return {
      quarter,
      objective,
      keyResults: keyResults.map((kr) => ({ ...kr, current: 0 }))
    };
  }
}
