import { CurrencyConversionService } from './CurrencyConversionService';

export class RevenueEngine {
  /**
   * Calcula a Receita Real baseada EXCLUSIVAMENTE nas comissões aprovadas/esperadas.
   * JAMAIS utiliza o valor bruto da venda do produto final.
   */
  public static calculateCommissionRevenue(commissionAmount: number, currency = 'BRL', baseCurrency = 'BRL'): number {
    const { amountBase } = CurrencyConversionService.convertToBaseCurrency(commissionAmount, currency, baseCurrency);
    return amountBase;
  }
}
