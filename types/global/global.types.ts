/**
 * Types for Module 10 - Global Market Expansion & Localization Engine
 */

export type MarketStatus = 'ACTIVE' | 'TESTING' | 'OPPORTUNITY' | 'DECLINING' | 'BLOCKED';

export type OpportunityRecommendation = 'BLOCK' | 'WAIT' | 'RESEARCH' | 'TEST' | 'EXPAND' | 'SCALE';

export type MarketRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MarketSummary {
  id: string;
  countryCode: string; // ISO 3166-1 alpha-2 (e.g., US, BR, DE, JP, UK)
  countryName: string;
  region: string;
  continent: string;
  defaultLanguage: string;
  languages: string[];
  currency: string;
  timezone: string;
  population: number;
  internetPenetration: number; // 0.0 to 100.0
  marketStatus: MarketStatus;
}

export interface MarketOpportunityResult {
  productId: string;
  country: string;
  language: string;
  currency: string;
  channel: string;
  opportunityScore: number; // 0 to 100
  expectedProfit: number;
  expectedROI: number;
  confidence: number;
  riskScore: number;
  localizationCost: number;
  netMarketValue: number; // Expected Profit - Localization Cost - Distribution Cost - Risk Penalty
  recommendation: OpportunityRecommendation;
  status: string;
}

export interface MarketProfileData {
  country: string;
  language: string;
  currency: string;
  timezone: string;
  consumerBehavior: {
    preferredPaymentMethods: string[];
    mobileShoppingPercent: number;
    priceSensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  ecommerceMaturity: number; // 0 to 100
  preferredChannels: string[];
  preferredFormats: string[];
  shoppingSeasonality: Array<{ name: string; month: number; impactMultiplier: number }>;
  regulatoryNotes: string;
  affiliateAvailability: boolean;
  marketSize: number;
  competitionLevel: number;
  averageOrderValue: number;
}

export interface GlobalPortfolioSummary {
  country: string;
  productCount: number;
  expectedRevenue: number;
  expectedProfit: number;
  marketShare: number;
  concentrationRisk: number;
}
