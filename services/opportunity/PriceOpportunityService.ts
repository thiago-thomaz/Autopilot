import { PriceFactor } from '../../types/opportunity/opportunity.factors';

export class PriceOpportunityService {
  /**
   * Avalia a atratividade do preço bruto em relação às faixas populares de conversão de afiliados.
   * Faixa de Preço Doce (Sweet Spot): R$ 50 a R$ 1500 (maior conversão em e-commerce).
   */
  public static analyzePrice(currentPrice: number, previousPrice?: number): PriceFactor {
    let score = 50;

    if (!currentPrice || currentPrice <= 0) {
      return {
        currentPrice: 0,
        discountPercent: 0,
        isSuspiciousDiscount: false,
        score: 0,
      };
    }

    if (currentPrice >= 50 && currentPrice <= 500) {
      score = 90; // Preço excelente para compras por impulso
    } else if (currentPrice > 500 && currentPrice <= 1500) {
      score = 80; // Boa faixa para eletrônicos e utilidades
    } else if (currentPrice > 1500 && currentPrice <= 4000) {
      score = 65; // Produtos de alto valor (notebooks, smart TVs)
    } else if (currentPrice > 4000) {
      score = 45; // Ticket alto, conversão mais lenta
    } else {
      score = 40; // Preço muito baixo (< R$ 50), comissão líquida irrisória
    }

    const discountPercent = previousPrice && previousPrice > currentPrice
      ? ((previousPrice - currentPrice) / previousPrice) * 100
      : 0;

    const isSuspiciousDiscount = discountPercent > 85 || (previousPrice !== undefined && previousPrice > currentPrice * 5);

    return {
      currentPrice,
      previousPrice,
      discountPercent,
      isSuspiciousDiscount,
      score,
    };
  }
}
