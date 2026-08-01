import { DecisionPayload, DecisionType } from '../../types/automation/automation.types';

export class ExperimentController {
  createExperiment(entityId: string, variants: string[]): DecisionPayload {
    return {
      scope: 'PRODUCT',
      entityType: 'Product',
      entityId,
      decisionType: DecisionType.START_EXPERIMENT,
      reason: `Initiating A/B experiment with ${variants.length} content variants.`,
      confidence: 0.8,
      riskScore: 25,
      priority: 2,
      metadata: { variants },
    };
  }
}
