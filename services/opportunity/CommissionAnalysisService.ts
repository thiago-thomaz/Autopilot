import { CommissionFactor } from '../../types/opportunity/opportunity.factors';

export class CommissionAnalysisService {
  /**
   * Avalia a atratividade financeira da comissão estimada (taxa * preço).
   */
  public static analyzeCommission(currentPrice: number, commissionRate?: number, estimatedCommission?: number): CommissionFactor {
    const rate = commissionRate || 0.05; // 5% por padrão
    const estimated = estimatedCommission !== undefined ? estimatedCommission : currentPrice * rate;

    let dataQuality: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    if (commissionRate !== undefined && estimatedCommission !== undefined) {
      dataQuality = 'HIGH';
    } else if (commissionRate === undefined) {
      dataQuality = 'LOW';
    }

    let score = 50;
    if (estimated >= 100) score = 95;      // Comissão bruta alta (R$ 100+)
    else if (estimated >= 40) score = 80;  // Boa comissão (R$ 40 - R$ 99)
    else if (estimated >= 15) score = 65;  // Comissão média (R$ 15 - R$ 39)
    else if (estimated >= 5) score = 45;   // Comissão baixa
    else score = 25;                       // Comissão irrisória (< R$ 5)

    return {
      commissionRate: rate,
      estimatedCommission: estimated,
      dataQuality,
      score,
    };
  }
}
