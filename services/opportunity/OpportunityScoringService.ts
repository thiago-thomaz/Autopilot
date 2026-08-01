import { OpportunityScoringConfig } from '../../types/opportunity/opportunity.types';
import { OpportunityRawFactors } from '../../types/opportunity/opportunity.factors';

export const DEFAULT_OPPORTUNITY_CONFIG: OpportunityScoringConfig = {
  algorithmVersion: 'v1.0.0',
  weights: {
    priceOffer: 0.20,
    priceHistory: 0.15,
    rating: 0.10,
    reviewVolume: 0.10,
    commission: 0.15,
    demand: 0.10,
    availability: 0.05,
    contentPotential: 0.10,
    dataQuality: 0.05,
  },
  bonuses: {
    nearHistoricalMinPrice: 10,
    excellentRating: 5,
    highCommissionRate: 5,
    highDemand: 5,
  },
  penalties: {
    missingPrice: 20,
    outOfStock: 30,
    noHistory: 5,
    lowRating: 15,
    suspiciousDiscount: 10,
  },
  thresholds: {
    exceptionalMinScore: 90,
    highMinScore: 80,
    goodMinScore: 70,
    moderateMinScore: 60,
    lowMinScore: 40,
  },
};

export class OpportunityScoringService {
  /**
   * Executa o cálculo determinístico do Opportunity Score com clamp (0..100).
   */
  public static calculate(
    factors: OpportunityRawFactors,
    config: OpportunityScoringConfig = DEFAULT_OPPORTUNITY_CONFIG,
    boostFactor = 1.0
  ) {
    const w = config.weights;

    // 1. Sub-scores (0 a 100)
    const priceScore = factors.price.score;
    const priceHistoryScore = factors.priceHistory.score;
    const discountScore = factors.price.discountPercent > 0 ? Math.min(100, factors.price.discountPercent * 2) : 0;
    const ratingScore = factors.rating.ratingScore;
    const reviewScore = factors.rating.reviewVolumeScore;
    const commissionScore = factors.commission.score;
    const demandScore = factors.demand.demandScore;
    const availabilityScore = factors.availability.score;
    const contentScore = factors.contentPotential.score;
    const dataQualityScore = factors.productQuality.score;

    // 2. Pontuação Ponderada Inicial (0 a 100)
    let rawWeightedScore =
      priceScore * w.priceOffer +
      priceHistoryScore * w.priceHistory +
      ratingScore * w.rating +
      reviewScore * w.reviewVolume +
      commissionScore * w.commission +
      demandScore * w.demand +
      availabilityScore * w.availability +
      contentScore * w.contentPotential +
      dataQualityScore * w.dataQuality;

    // 3. Aplicação de Bônus
    const bonusesApplied: { name: string; points: number }[] = [];

    if (factors.priceHistory.isNearHistoricalMin) {
      const pts = config.bonuses.nearHistoricalMinPrice;
      bonusesApplied.push({ name: 'Preço Próximo da Mínima Histórica', points: pts });
      rawWeightedScore += pts;
    }

    if (factors.rating.rating >= 4.7 && factors.rating.reviewCount >= 20) {
      const pts = config.bonuses.excellentRating;
      bonusesApplied.push({ name: 'Avaliação Excelente (4.7+ com reviews)', points: pts });
      rawWeightedScore += pts;
    }

    if (factors.commission.commissionRate >= 0.08 || factors.commission.estimatedCommission >= 40) {
      const pts = config.bonuses.highCommissionRate;
      bonusesApplied.push({ name: 'Comissão Atrativa (>= 8% ou R$ 40+)', points: pts });
      rawWeightedScore += pts;
    }

    if (factors.demand.demandScore >= 80) {
      const pts = config.bonuses.highDemand;
      bonusesApplied.push({ name: 'Alta Demanda Observada', points: pts });
      rawWeightedScore += pts;
    }

    // 4. Aplicação de Penalidades
    const penaltiesApplied: { name: string; points: number }[] = [];

    if (factors.price.currentPrice <= 0) {
      const pts = config.penalties.missingPrice;
      penaltiesApplied.push({ name: 'Preço Ausente ou Inválido', points: -pts });
      rawWeightedScore -= pts;
    }

    if (factors.availability.status === 'OUT_OF_STOCK') {
      const pts = config.penalties.outOfStock;
      penaltiesApplied.push({ name: 'Produto Fora de Estoque', points: -pts });
      rawWeightedScore -= pts;
    }

    if (factors.priceHistory.historyQuality === 'INSUFFICIENT_HISTORY') {
      const pts = config.penalties.noHistory;
      penaltiesApplied.push({ name: 'Histórico de Preço Insuficiente', points: -pts });
      rawWeightedScore -= pts;
    }

    if (factors.rating.rating > 0 && factors.rating.rating < 3.5) {
      const pts = config.penalties.lowRating;
      penaltiesApplied.push({ name: 'Avaliação Baixa (< 3.5)', points: -pts });
      rawWeightedScore -= pts;
    }

    if (factors.price.isSuspiciousDiscount) {
      const pts = config.penalties.suspiciousDiscount;
      penaltiesApplied.push({ name: 'Desconto Suspeito (> 85%)', points: -pts });
      rawWeightedScore -= pts;
    }

    // 5. Aplicar boost de Allowlist (se houver)
    rawWeightedScore = rawWeightedScore * boostFactor;

    // 6. Funções Clamp (Garante intervalo 0..100 obrigatoriamente)
    const finalScore = Math.max(0, Math.min(100, Math.round(rawWeightedScore)));

    // 7. Cálculo do Confidence Score (0..100)
    let confidence = 50; // Base neutra
    if (factors.priceHistory.historyQuality === 'SUFFICIENT_HISTORY') confidence += 20;
    else if (factors.priceHistory.historyQuality === 'LIMITED_HISTORY') confidence += 10;

    if (factors.productQuality.score >= 80) confidence += 15;
    if (factors.commission.dataQuality === 'HIGH') confidence += 15;
    if (factors.availability.status === 'IN_STOCK') confidence += 10;

    const confidenceScore = Math.max(0, Math.min(100, Math.round(confidence)));

    // 8. Score Ajustado
    const adjustedScore = Math.max(0, Math.min(100, Math.round(finalScore * (0.5 + 0.5 * (confidenceScore / 100)))));

    return {
      score: finalScore,
      confidenceScore,
      adjustedScore,
      factorScores: {
        priceScore,
        priceHistoryScore,
        discountScore,
        ratingScore,
        reviewScore,
        commissionScore,
        demandScore,
        availabilityScore,
        contentScore,
        dataQualityScore,
      },
      bonusesApplied,
      penaltiesApplied,
    };
  }
}
