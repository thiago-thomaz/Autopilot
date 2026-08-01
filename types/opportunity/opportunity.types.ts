import { z } from 'zod';
import { OpportunityClassification, OpportunityPriority } from '@prisma/client';

export interface OpportunityScoringConfig {
  algorithmVersion: string;
  weights: {
    priceOffer: number;      // 0.20 (20%)
    priceHistory: number;    // 0.15 (15%)
    rating: number;          // 0.10 (10%)
    reviewVolume: number;    // 0.10 (10%)
    commission: number;      // 0.15 (15%)
    demand: number;          // 0.10 (10%)
    availability: number;    // 0.05 (5%)
    contentPotential: number;// 0.10 (10%)
    dataQuality: number;     // 0.05 (5%)
  };
  bonuses: {
    nearHistoricalMinPrice: number; // +10
    excellentRating: number;        // +5
    highCommissionRate: number;     // +5
    highDemand: number;             // +5
  };
  penalties: {
    missingPrice: number;           // -20
    outOfStock: number;             // -30
    noHistory: number;              // -5
    lowRating: number;              // -15
    suspiciousDiscount: number;     // -10
  };
  thresholds: {
    exceptionalMinScore: number;    // 90
    highMinScore: number;           // 80
    goodMinScore: number;           // 70
    moderateMinScore: number;       // 60
    lowMinScore: number;            // 40
  };
}

export const OpportunityScoringConfigSchema = z.object({
  algorithmVersion: z.string().default('v1.0.0'),
  weights: z.object({
    priceOffer: z.number().min(0).max(1),
    priceHistory: z.number().min(0).max(1),
    rating: z.number().min(0).max(1),
    reviewVolume: z.number().min(0).max(1),
    commission: z.number().min(0).max(1),
    demand: z.number().min(0).max(1),
    availability: z.number().min(0).max(1),
    contentPotential: z.number().min(0).max(1),
    dataQuality: z.number().min(0).max(1),
  }).refine((w) => {
    const sum = Object.values(w).reduce((a, b) => a + b, 0);
    return Math.abs(sum - 1.0) < 0.001;
  }, { message: 'A soma exata dos pesos deve ser 1.0 (100%).' }),
  bonuses: z.object({
    nearHistoricalMinPrice: z.number().default(10),
    excellentRating: z.number().default(5),
    highCommissionRate: z.number().default(5),
    highDemand: z.number().default(5),
  }),
  penalties: z.object({
    missingPrice: z.number().default(20),
    outOfStock: z.number().default(30),
    noHistory: z.number().default(5),
    lowRating: z.number().default(15),
    suspiciousDiscount: z.number().default(10),
  }),
  thresholds: z.object({
    exceptionalMinScore: z.number().default(90),
    highMinScore: z.number().default(80),
    goodMinScore: z.number().default(70),
    moderateMinScore: z.number().default(60),
    lowMinScore: z.number().default(40),
  }),
});

export interface OpportunityExplanation {
  positives: string[];
  negatives: string[];
  warnings: string[];
}

export interface OpportunityAnalysisResult {
  productId: string;
  score: number;                   // 0 .. 100
  confidenceScore: number;         // 0 .. 100
  adjustedScore: number;           // score * (0.5 + 0.5 * (confidence / 100))
  classification: OpportunityClassification;
  priority: OpportunityPriority;
  factorScores: {
    priceScore: number;
    priceHistoryScore: number;
    discountScore: number;
    ratingScore: number;
    reviewScore: number;
    commissionScore: number;
    demandScore: number;
    availabilityScore: number;
    contentScore: number;
    dataQualityScore: number;
  };
  bonusesApplied: { name: string; points: number }[];
  penaltiesApplied: { name: string; points: number }[];
  explanation: OpportunityExplanation;
  algorithmVersion: string;
  createdAt: Date;
}
