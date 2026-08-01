export class CurrencyConversionService {
  private static rates: Record<string, number> = {
    BRL: 1.0,
    USD: 0.18,
    EUR: 0.16,
    GBP: 0.14,
    JPY: 27.5,
  };

  /**
   * Converte montante de moeda original para a moeda base informada (padrão: BRL).
   */
  public static convertToBaseCurrency(amount: number, fromCurrency = 'BRL', baseCurrency = 'BRL'): { amountBase: number; exchangeRate: number } {
    const rateFrom = this.rates[fromCurrency] || 1.0;
    const rateBase = this.rates[baseCurrency] || 1.0;

    const exchangeRate = rateBase / rateFrom;
    const amountBase = Number((amount * exchangeRate).toFixed(4));

    return { amountBase, exchangeRate };
  }
}
