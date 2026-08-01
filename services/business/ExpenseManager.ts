import { CostCenterCategory } from '@prisma/client';

export interface ExpenseRecord {
  id?: string;
  category: string;
  vendor?: string;
  amount: number;
  currency: string;
  costCenter: CostCenterCategory;
  date: Date | string;
}

export class ExpenseManager {
  private expenses: ExpenseRecord[] = [];

  public addExpense(expense: ExpenseRecord): void {
    this.expenses.push(expense);
  }

  public getTotalByCostCenter(costCenter: CostCenterCategory): number {
    return this.expenses
      .filter((e) => e.costCenter === costCenter)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  public getTotalExpenses(): number {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0);
  }
}
