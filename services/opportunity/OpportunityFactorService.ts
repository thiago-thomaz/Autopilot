import { OpportunityRawFactors } from '../../types/opportunity/opportunity.factors';
import { PriceOpportunityService } from './PriceOpportunityService';
import { PriceHistoryAnalysisService, PriceHistoryRecord } from './PriceHistoryAnalysisService';
import { CommissionAnalysisService } from './CommissionAnalysisService';
import { DemandAnalysisService } from './DemandAnalysisService';
import { ProductQualityService } from './ProductQualityService';
import { ContentPotentialService } from './ContentPotentialService';

export interface RawProductData {
  id: string;
  externalId: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  category?: string;
  brand?: string;
  currentPrice: number;
  previousPrice?: number;
  rating?: number;
  reviewCount?: number;
  availability: boolean;
  commissionRate?: number;
  estimatedCommission?: number;
  priceHistory?: PriceHistoryRecord[];
  observedClicks?: number;
  observedConversions?: number;
}

export class OpportunityFactorService {
  /**
   * Consolida todos os fatores brutos de um produto em sub-scores padronizados (0 a 100).
   */
  public static extractFactors(data: RawProductData): OpportunityRawFactors {
    const priceFactor = PriceOpportunityService.analyzePrice(data.currentPrice, data.previousPrice);
    const historyFactor = PriceHistoryAnalysisService.analyzeHistory(data.currentPrice, data.priceHistory || []);
    const commissionFactor = CommissionAnalysisService.analyzeCommission(data.currentPrice, data.commissionRate, data.estimatedCommission);
    const demandFactor = DemandAnalysisService.analyzeDemand(data.observedClicks, data.observedConversions);
    const qualityFactor = ProductQualityService.analyzeQuality(data.title, data.description, data.imageUrl, data.brand);
    const contentFactor = ContentPotentialService.analyzeContentPotential(data.category, data.title, priceFactor.discountPercent);

    // Rating Score e Review Volume Score (com normalização logarítmica)
    const rating = data.rating || 0;
    let ratingScore = 30;
    if (rating >= 4.7) ratingScore = 100;
    else if (rating >= 4.3) ratingScore = 85;
    else if (rating >= 4.0) ratingScore = 70;
    else if (rating >= 3.5) ratingScore = 50;

    const reviewCount = data.reviewCount || 0;
    // Normalização logarítmica: Math.log(1 + reviewCount) / Math.log(1 + 5000) * 100
    const reviewVolumeScore = Math.min(100, Math.round((Math.log(1 + reviewCount) / Math.log(1 + 5000)) * 100));

    let availabilityStatus: 'IN_STOCK' | 'LIMITED_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN' = 'IN_STOCK';
    let availabilityScore = 100;

    if (!data.availability) {
      availabilityStatus = 'OUT_OF_STOCK';
      availabilityScore = 0;
    }

    return {
      price: priceFactor,
      priceHistory: historyFactor,
      rating: {
        rating,
        reviewCount,
        ratingScore,
        reviewVolumeScore,
      },
      commission: commissionFactor,
      demand: demandFactor,
      contentPotential: contentFactor,
      productQuality: qualityFactor,
      availability: {
        status: availabilityStatus,
        score: availabilityScore,
      },
    };
  }
}
