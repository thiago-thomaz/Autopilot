export class RecommendationEngine {
  /**
   * Emite recomendações orientadas a dados (OptimizationSignal) para revisão humana ou automação futura.
   */
  public static generateSignals(productPerformance: Array<{ productId: string; roi: number | null; cvr: number }>) {
    const signals = [];

    for (const p of productPerformance) {
      if (p.roi !== null && p.roi > 200 && p.cvr > 3.0) {
        signals.push({
          type: 'INCREASE_PRIORITY',
          scope: 'PRODUCT',
          entityId: p.productId,
          reason: `Excelente ROI (${p.roi.toFixed(0)}%) e taxa de conversão (${p.cvr.toFixed(1)}%).`,
          recommendedAction: 'Aumentar a frequência de publicação e distribuição em novos canais.',
          confidence: 0.9,
        });
      } else if (p.roi !== null && p.roi < -50) {
        signals.push({
          type: 'PAUSE',
          scope: 'PRODUCT',
          entityId: p.productId,
          reason: `ROI negativo (${p.roi.toFixed(0)}%) acumulado.`,
          recommendedAction: 'Pausar distribuição e revisar copy ou oferta.',
          confidence: 0.85,
        });
      }
    }

    return signals;
  }
}
