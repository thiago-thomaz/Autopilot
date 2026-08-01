export class LocalizationEngine {
  private static exchangeRates: Record<string, number> = {
    BRL: 1.0,
    USD: 0.18,
    EUR: 0.16,
    GBP: 0.14,
    JPY: 27.5,
  };

  /**
   * Converte o valor de uma moeda para outra.
   */
  public static convertCurrency(amount: number, fromCurrency = 'BRL', toCurrency = 'BRL'): { convertedAmount: number; currency: string } {
    const rateFrom = this.exchangeRates[fromCurrency] || 1.0;
    const rateTo = this.exchangeRates[toCurrency] || 1.0;

    const inBase = amount / rateFrom;
    const convertedAmount = Number((inBase * rateTo).toFixed(2));

    return { convertedAmount, currency: toCurrency };
  }

  /**
   * Formata preços de acordo com o padrão do país/idioma.
   */
  public static formatPrice(amount: number, currency = 'BRL', locale = 'pt-BR'): string {
    const symbols: Record<string, string> = { BRL: 'R$', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
    const symbol = symbols[currency] || currency;

    if (locale.startsWith('pt') || locale.startsWith('es')) {
      return `${symbol} ${amount.toFixed(2).replace('.', ',')}`;
    }
    return `${symbol}${amount.toFixed(2)}`;
  }
}
