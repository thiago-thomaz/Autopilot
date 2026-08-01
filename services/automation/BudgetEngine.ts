import { BudgetExceededError } from '../../types/automation/automation.errors';
import { ActionCostEstimator } from './ActionCostEstimator';
import { AutomationPersistenceService } from './AutomationPersistenceService';
import { ActionType } from '../../types/automation/automation.types';

export class BudgetEngine {
  private costEstimator: ActionCostEstimator;
  private persistence: AutomationPersistenceService;

  constructor(persistence?: AutomationPersistenceService) {
    this.costEstimator = new ActionCostEstimator();
    this.persistence = persistence || new AutomationPersistenceService();
  }

  async validateActionBudget(actionType: ActionType, payload?: Record<string, any>, scope = 'GLOBAL', scopeId = 'GLOBAL') {
    const estimate = this.costEstimator.estimateCost(actionType, payload);
    const budget = await this.persistence.getBudget(scope, scopeId);

    const projectedSpend = budget.currentDailySpend + estimate.totalCost;
    if (projectedSpend > budget.dailyBudget) {
      throw new BudgetExceededError(
        `Daily automation budget exceeded. Current: $${budget.currentDailySpend}, Projected: $${projectedSpend}, Limit: $${budget.dailyBudget}`,
        { budget, estimate }
      );
    }

    if (budget.currentDailySpend > budget.dailyLossLimit) {
      throw new BudgetExceededError(
        `Daily loss limit reached ($${budget.currentDailySpend} > $${budget.dailyLossLimit}). All autonomous spending actions are paused.`,
        { budget }
      );
    }

    return {
      allowed: true,
      estimate,
      budget,
    };
  }

  async recordSpend(amount: number, scope = 'GLOBAL', scopeId = 'GLOBAL') {
    return await this.persistence.updateSpend(amount, scope, scopeId);
  }
}
