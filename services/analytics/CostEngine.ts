import { CurrencyConversionService } from './CurrencyConversionService';

export class CostEngine {
  /**
   * Consolida e converte custos de infraestrutura, LLM e mensagens para a moeda base.
   */
  public static calculateTotalCost(costs: Array<{ amount: number; currency: string }>, baseCurrency = 'BRL'): number {
    let total = 0;
    for (const c of costs) {
      const { amountBase } = CurrencyConversionService.convertToBaseCurrency(c.amount, c.currency, baseCurrency);
      total += amountBase;
    }
    return Number(total.toFixed(4));
  }
}
