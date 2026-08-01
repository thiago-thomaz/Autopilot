import { MetricSnapshot } from '../../types/automation/automation.types';
import { AutomationPersistenceService } from './AutomationPersistenceService';

export class LearningEngine {
  private persistence: AutomationPersistenceService;

  constructor(persistence?: AutomationPersistenceService) {
    this.persistence = persistence || new AutomationPersistenceService();
  }

  async recordLearningOutcome(decisionId: string, before: MetricSnapshot, after: MetricSnapshot) {
    const outcome = await this.persistence.saveDecisionOutcome(decisionId, before, after);

    const profitImpact = after.profit - before.profit;
    const success = profitImpact >= 0;

    await this.persistence.logAudit('LEARNING_ENGINE', 'RECORD_OUTCOME', 'Decision', decisionId, {
      success,
      profitImpact,
      roiImpact: after.roi - before.roi,
    });

    return outcome;
  }
}
