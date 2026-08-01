import { DemandFactor } from '../../types/opportunity/opportunity.factors';

export class DemandAnalysisService {
  /**
   * Avalia a demanda observada com base no histórico de cliques e conversões do canal.
   * Se não houver dados históricos de desempenho, retorna score 50 (neutro) e confiança 'LOW'.
   */
  public static analyzeDemand(observedClicks?: number, observedConversions?: number): DemandFactor {
    if (observedClicks === undefined || observedClicks === 0) {
      return {
        observedClicks: 0,
        observedConversions: 0,
        demandScore: 50,
        confidence: 'LOW',
      };
    }

    const conversionRate = (observedConversions || 0) / observedClicks;
    let demandScore = 50;

    if (conversionRate >= 0.05) demandScore = 95;      // Excelente conversão (>= 5%)
    else if (conversionRate >= 0.02) demandScore = 80;  // Boa conversão (2% - 5%)
    else if (conversionRate >= 0.01) demandScore = 65;  // Média (1%)
    else demandScore = 35;                              // Conversão baixa (< 1%)

    const confidence = observedClicks >= 50 ? 'HIGH' : 'MEDIUM';

    return {
      observedClicks,
      observedConversions: observedConversions || 0,
      demandScore,
      confidence,
    };
  }
}
