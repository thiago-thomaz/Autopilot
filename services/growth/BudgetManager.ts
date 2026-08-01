import { BudgetScope } from '@prisma/client';
import { BudgetExceededError } from '../../types/growth/growth.errors';

export interface ScopeLimit {
  scope: BudgetScope;
  scopeId: string;
  maxBudget: number;
  currentSpend: number;
}

export class BudgetManager {
  private limits: Map<string, ScopeLimit> = new Map();

  public setLimit(limit: ScopeLimit): void {
    const key = `${limit.scope}:${limit.scopeId}`;
    this.limits.set(key, limit);
  }

  public validateSpend(scope: BudgetScope, scopeId: string, amount: number): boolean {
    const key = `${scope}:${scopeId}`;
    const limit = this.limits.get(key);
    if (!limit) return true; // No explicit limit defined

    if (limit.currentSpend + amount > limit.maxBudget) {
      throw new BudgetExceededError(amount, limit.maxBudget - limit.currentSpend, key);
    }
    return true;
  }

  public recordSpend(scope: BudgetScope, scopeId: string, amount: number): void {
    this.validateSpend(scope, scopeId, amount);
    const key = `${scope}:${scopeId}`;
    const limit = this.limits.get(key);
    if (limit) {
      limit.currentSpend += amount;
    }
  }

  public getRemaining(scope: BudgetScope, scopeId: string): number {
    const key = `${scope}:${scopeId}`;
    const limit = this.limits.get(key);
    if (!limit) return Infinity;
    return Math.max(0, limit.maxBudget - limit.currentSpend);
  }
}
