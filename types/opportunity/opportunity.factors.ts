export interface PriceFactor {
  currentPrice: number;
  previousPrice?: number;
  discountPercent: number;
  isSuspiciousDiscount: boolean;
  score: number; // 0..100
}

export interface PriceHistoryFactor {
  recordCount: number;
  historyQuality: 'INSUFFICIENT_HISTORY' | 'LIMITED_HISTORY' | 'SUFFICIENT_HISTORY';
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  isNearHistoricalMin: boolean;
  score: number; // 0..100
}

export interface RatingFactor {
  rating: number; // 0..5
  reviewCount: number;
  ratingScore: number; // 0..100
  reviewVolumeScore: number; // 0..100
}

export interface CommissionFactor {
  commissionRate: number; // e.g. 0.08
  estimatedCommission: number; // BRL
  dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number; // 0..100
}

export interface DemandFactor {
  observedClicks?: number;
  observedConversions?: number;
  demandScore: number; // 0..100 (50 se desconhecido)
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ContentPotentialFactor {
  category: string;
  recommendedTypes: string[]; // e.g. ["REVIEW", "TOP_LIST", "DEAL_ALERT"]
  score: number; // 0..100
}

export interface ProductQualityFactor {
  hasTitle: boolean;
  hasDescription: boolean;
  hasImage: boolean;
  hasBrand: boolean;
  score: number; // 0..100
}

export interface OpportunityRawFactors {
  price: PriceFactor;
  priceHistory: PriceHistoryFactor;
  rating: RatingFactor;
  commission: CommissionFactor;
  demand: DemandFactor;
  contentPotential: ContentPotentialFactor;
  productQuality: ProductQualityFactor;
  availability: {
    status: 'IN_STOCK' | 'LIMITED_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
    score: number; // 0..100
  };
}
