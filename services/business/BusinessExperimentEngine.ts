export interface MacroBusinessExperiment {
  id: string;
  name: string;
  hypothesis: string;
  controlModel: string;
  treatmentModel: string;
  sampleRatio: number;
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'CANCELLED';
  winnerModel?: string;
}

export class BusinessExperimentEngine {
  public createMacroExperiment(name: string, hypothesis: string, controlModel: string, treatmentModel: string): MacroBusinessExperiment {
    return {
      id: `mexp_${Date.now()}`,
      name,
      hypothesis,
      controlModel,
      treatmentModel,
      sampleRatio: 0.5,
      status: 'DRAFT'
    };
  }
}
