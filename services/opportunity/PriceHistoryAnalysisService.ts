import { PriceHistoryFactor } from '../../types/opportunity/opportunity.factors';

export interface PriceHistoryRecord {
  price: number;
  capturedAt: Date;
}

export class PriceHistoryAnalysisService {
  /**
   * Avalia o histórico recente de preços (mínimo, máximo, média e proximidade do mínimo histórico).
   */
  public static analyzeHistory(currentPrice: number, history: PriceHistoryRecord[]): PriceHistoryFactor {
    if (!history || history.length === 0) {
      return {
        recordCount: 0,
        historyQuality: 'INSUFFICIENT_HISTORY',
        minPrice: currentPrice,
        maxPrice: currentPrice,
        avgPrice: currentPrice,
        isNearHistoricalMin: false,
        score: 30, // Pontuação neutra por falta de histórico
      };
    }

    const prices = history.map((h) => h.price);
    const minPrice = Math.min(...prices, currentPrice);
    const maxPrice = Math.max(...prices, currentPrice);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    const recordCount = history.length;
    let historyQuality: 'INSUFFICIENT_HISTORY' | 'LIMITED_HISTORY' | 'SUFFICIENT_HISTORY' = 'INSUFFICIENT_HISTORY';

    if (recordCount >= 7) historyQuality = 'SUFFICIENT_HISTORY';
    else if (recordCount >= 3) historyQuality = 'LIMITED_HISTORY';

    // O produto está muito próximo do menor preço histórico (até 3% acima do menor)?
    const isNearHistoricalMin = currentPrice <= minPrice * 1.03;

    let score = 50;
    if (isNearHistoricalMin) score = 95;
    else if (currentPrice < avgPrice) score = 75;
    else if (currentPrice === avgPrice) score = 50;
    else score = 30; // Preço acima da média histórica

    return {
      recordCount,
      historyQuality,
      minPrice,
      maxPrice,
      avgPrice,
      isNearHistoricalMin,
      score,
    };
  }
}
