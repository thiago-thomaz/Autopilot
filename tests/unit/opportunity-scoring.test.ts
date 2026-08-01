import { describe, it, expect } from 'vitest';
import { OpportunityScoringService, DEFAULT_OPPORTUNITY_CONFIG } from '../../services/opportunity/OpportunityScoringService';
import { OpportunityRawFactors } from '../../types/opportunity/opportunity.factors';

describe('OpportunityScoringService (Fórmula & Clamp 0..100)', () => {
  it('deve calcular o score ponderado correto e garantir clamp entre 0 e 100', () => {
    const mockFactors: OpportunityRawFactors = {
      price: { currentPrice: 500, previousPrice: 700, discountPercent: 28.5, isSuspiciousDiscount: false, score: 90 },
      priceHistory: { recordCount: 10, historyQuality: 'SUFFICIENT_HISTORY', minPrice: 490, maxPrice: 700, avgPrice: 600, isNearHistoricalMin: true, score: 95 },
      rating: { rating: 4.8, reviewCount: 2500, ratingScore: 100, reviewVolumeScore: 90 },
      commission: { commissionRate: 0.08, estimatedCommission: 40, dataQuality: 'HIGH', score: 80 },
      demand: { observedClicks: 100, observedConversions: 5, demandScore: 95, confidence: 'HIGH' },
      contentPotential: { category: 'Informática', recommendedTypes: ['REVIEW', 'TOP_LIST'], score: 90 },
      productQuality: { hasTitle: true, hasDescription: true, hasImage: true, hasBrand: true, score: 100 },
      availability: { status: 'IN_STOCK', score: 100 },
    };

    const res = OpportunityScoringService.calculate(mockFactors, DEFAULT_OPPORTUNITY_CONFIG);

    expect(res.score).toBeGreaterThanOrEqual(0);
    expect(res.score).toBeLessThanOrEqual(100);
    expect(res.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(res.confidenceScore).toBeLessThanOrEqual(100);
    expect(res.adjustedScore).toBeGreaterThanOrEqual(0);
    expect(res.adjustedScore).toBeLessThanOrEqual(100);
  });

  it('deve aplicar penalidade severa (-30) quando o produto estiver fora de estoque', () => {
    const mockFactors: OpportunityRawFactors = {
      price: { currentPrice: 500, discountPercent: 0, isSuspiciousDiscount: false, score: 90 },
      priceHistory: { recordCount: 0, historyQuality: 'INSUFFICIENT_HISTORY', minPrice: 500, maxPrice: 500, avgPrice: 500, isNearHistoricalMin: false, score: 30 },
      rating: { rating: 4.0, reviewCount: 100, ratingScore: 70, reviewVolumeScore: 50 },
      commission: { commissionRate: 0.05, estimatedCommission: 25, dataQuality: 'MEDIUM', score: 65 },
      demand: { demandScore: 50, confidence: 'LOW' },
      contentPotential: { category: 'Geral', recommendedTypes: ['REVIEW'], score: 60 },
      productQuality: { hasTitle: true, hasDescription: false, hasImage: true, hasBrand: false, score: 70 },
      availability: { status: 'OUT_OF_STOCK', score: 0 },
    };

    const res = OpportunityScoringService.calculate(mockFactors, DEFAULT_OPPORTUNITY_CONFIG);

    const hasStockPenalty = res.penaltiesApplied.some((p) => p.name.includes('Fora de Estoque'));
    expect(hasStockPenalty).toBe(true);
    expect(res.score).toBeLessThan(70);
  });
});
