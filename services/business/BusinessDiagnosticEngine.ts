import { BusinessDiagnosticReport } from '../../types/business/business.types';

export class BusinessDiagnosticEngine {
  public generateDiagnosticReport(
    netProfit: number,
    roi: number,
    diversificationScore: number,
    cashBalance: number,
    minimumReserve: number
  ): BusinessDiagnosticReport {
    let financialHealth: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL' = 'HEALTHY';
    if (netProfit > 10000 && roi >= 50) {
      financialHealth = 'EXCELLENT';
    } else if (netProfit < 0 || roi < 0) {
      financialHealth = 'CRITICAL';
    } else if (roi < 15) {
      financialHealth = 'WARNING';
    }

    let diversificationStatus: 'BALANCED' | 'CONCENTRATED' | 'HIGH_RISK' = 'BALANCED';
    if (diversificationScore < 40) {
      diversificationStatus = 'HIGH_RISK';
    } else if (diversificationScore < 70) {
      diversificationStatus = 'CONCENTRATED';
    }

    let cashReserveStatus: 'NORMAL' | 'WARNING' | 'SAFETY_LOCK' = 'NORMAL';
    if (cashBalance < minimumReserve) {
      cashReserveStatus = 'SAFETY_LOCK';
    } else if (cashBalance < minimumReserve * 1.3) {
      cashReserveStatus = 'WARNING';
    }

    const overallHealthScore = Number(
      Math.min(
        100,
        Math.max(
          0,
          (financialHealth === 'EXCELLENT' ? 100 : financialHealth === 'HEALTHY' ? 80 : 40) * 0.5 +
            diversificationScore * 0.3 +
            (cashReserveStatus === 'NORMAL' ? 100 : 30) * 0.2
        )
      ).toFixed(2)
    );

    const topRecommendations: string[] = [];
    if (cashReserveStatus === 'SAFETY_LOCK') {
      topRecommendations.push('CASH SAFETY LOCK ACTIVE: Halt non-essential marketing/AI spend and retain operational reserves.');
    }
    if (diversificationStatus !== 'BALANCED') {
      topRecommendations.push('CONCENTRATION RISK: Rebalance portfolio to reduce single point of failure.');
    }
    if (financialHealth === 'CRITICAL' || financialHealth === 'WARNING') {
      topRecommendations.push('MARGIN OPTIMIZATION: Pause unprofitable campaigns and cut secondary cost centers.');
    }

    return {
      overallHealthScore,
      financialHealth,
      diversificationStatus,
      cashReserveStatus,
      topRecommendations,
      activeRisksCount: topRecommendations.length
    };
  }
}
