export interface AllocationDecision {
  action: 'EXPLOITATION' | 'EXPLORATION';
  budgetPercentage: number;
  selectedEntityId: string;
  strategy: 'EPSILON_GREEDY' | 'UCB1';
}

export class ExplorationEngine {
  private readonly explorationBudgetPercent: number = 10; // Default 10% exploration

  constructor(explorationBudgetPercent: number = 10) {
    this.explorationBudgetPercent = explorationBudgetPercent;
  }

  public decideAllocation(
    validatedOpportunityIds: string[],
    untestedOpportunityIds: string[]
  ): AllocationDecision {
    const isExploration = Math.random() * 100 < this.explorationBudgetPercent;

    if (isExploration && untestedOpportunityIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * untestedOpportunityIds.length);
      return {
        action: 'EXPLORATION',
        budgetPercentage: this.explorationBudgetPercent,
        selectedEntityId: untestedOpportunityIds[randomIndex],
        strategy: 'EPSILON_GREEDY'
      };
    }

    const primaryId = validatedOpportunityIds.length > 0 ? validatedOpportunityIds[0] : (untestedOpportunityIds[0] || 'default');
    return {
      action: 'EXPLOITATION',
      budgetPercentage: 100 - this.explorationBudgetPercent,
      selectedEntityId: primaryId,
      strategy: 'EPSILON_GREEDY'
    };
  }
}
