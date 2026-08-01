export class DiscountAnalysisService {
  /**
   * Calcula o sub-score do desconto real e identifica anomalias (SUSPICIOUS_DISCOUNT).
   */
  public static calculateDiscountScore(currentPrice: number, previousPrice?: number): { discountScore: number; isSuspicious: boolean } {
    if (!previousPrice || previousPrice <= currentPrice) {
      return { discountScore: 0, isSuspicious: false };
    }

    const discountPercent = ((previousPrice - currentPrice) / previousPrice) * 100;

    if (discountPercent > 85) {
      // Desconto acima de 85% suspeito (ex: inflado na "metade do dobro")
      return { discountScore: 30, isSuspicious: true };
    }

    let discountScore = 0;
    if (discountPercent >= 50) discountScore = 100;
    else if (discountPercent >= 30) discountScore = 85;
    else if (discountPercent >= 20) discountScore = 70;
    else if (discountPercent >= 10) discountScore = 50;
    else discountScore = 30;

    return { discountScore, isSuspicious: false };
  }
}
