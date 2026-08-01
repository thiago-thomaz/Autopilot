export interface AICostBudget {
  dailyTokenLimit: number;
  monthlySpendLimit: number;
  currentDailyTokens: number;
  currentMonthlySpend: number;
}

export class AICostController {
  private budget: AICostBudget = {
    dailyTokenLimit: 500000,
    monthlySpendLimit: 200,
    currentDailyTokens: 0,
    currentMonthlySpend: 0
  };

  public recordUsage(tokens: number, estimatedCost: number): boolean {
    this.budget.currentDailyTokens += tokens;
    this.budget.currentMonthlySpend += estimatedCost;
    return this.isWithinBudget();
  }

  public isWithinBudget(): boolean {
    return (
      this.budget.currentDailyTokens <= this.budget.dailyTokenLimit &&
      this.budget.currentMonthlySpend <= this.budget.monthlySpendLimit
    );
  }

  public getBudgetStatus(): AICostBudget {
    return { ...this.budget };
  }
}
