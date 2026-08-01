export class AnomalyDetectionEngine {
  /**
   * Monitora desvios significativos nas métricas de cliques, conversão e custos.
   */
  public static detectAnomalies(currentCTR: number, historicalCTR: number, currentCost: number, historicalCost: number) {
    const alerts: Array<{ type: string; severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL'; message: string }> = [];

    if (historicalCTR > 0 && currentCTR < historicalCTR * 0.5) {
      alerts.push({
        type: 'CTR_DROP',
        severity: 'HIGH',
        message: `Queda acentuada no CTR: atua l${currentCTR.toFixed(2)}% vs histórico ${historicalCTR.toFixed(2)}%`,
      });
    }

    if (historicalCost > 0 && currentCost > historicalCost * 2.0) {
      alerts.push({
        type: 'COST_SPIKE',
        severity: 'CRITICAL',
        message: `Aumento atípico nos custos: R$ ${currentCost.toFixed(2)} vs média R$ ${historicalCost.toFixed(2)}`,
      });
    }

    return alerts;
  }
}
