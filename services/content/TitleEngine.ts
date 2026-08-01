export class TitleEngine {
  /**
   * Gera variações de título formatadas por canal.
   */
  public static generateTitle(title: string, currentPrice: number, previousPrice?: number): string {
    if (previousPrice && previousPrice > currentPrice) {
      const discountPercent = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
      return `${title} com ${discountPercent}% de Desconto (R$ ${currentPrice.toFixed(2)})`;
    }
    return `${title} por R$ ${currentPrice.toFixed(2)} - Análise Completa`;
  }
}
