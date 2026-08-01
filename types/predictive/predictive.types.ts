/**
 * Types for Module 9 - AI Learning & Predictive Intelligence Engine
 */

export type AIMaturityLevel = 
  | 'LEVEL_0_RULES'
  | 'LEVEL_1_STATISTICAL'
  | 'LEVEL_2_ML'
  | 'LEVEL_3_ENSEMBLE'
  | 'LEVEL_4_PREDICTIVE'
  | 'LEVEL_5_ADAPTIVE';

export type ModelType = 
  | 'BASELINE'
  | 'STATISTICAL'
  | 'ML_CLASSIFICATION'
  | 'ML_REGRESSION'
  | 'ENSEMBLE';

export type ModelTarget = 
  | 'CONVERSION'
  | 'COMMISSION'
  | 'PROFIT'
  | 'ROI'
  | 'EPC'
  | 'REVENUE'
  | 'COST'
  | 'JOURNEY'
  | 'SEO';

export type ModelStatus = 
  | 'TRAINING'
  | 'VALIDATING'
  | 'ACTIVE'
  | 'SHADOW'
  | 'DEPRECATED'
  | 'FAILED';

export type PredictionType = 
  | 'CVR'
  | 'COMMISSION_PROBABILITY'
  | 'PROFIT_PROBABILITY'
  | 'EXPECTED_PROFIT'
  | 'EXPECTED_ROI'
  | 'EXPECTED_EPC'
  | 'EXPECTED_REVENUE'
  | 'OPPORTUNITY_SCORE'
  | 'JOURNEY'
  | 'SEO';

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface PredictionResult {
  id?: string;
  predictionType: PredictionType;
  entityType: string;
  entityId: string;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
  confidenceScore: number; // 0.0 to 1.0
  confidenceLevel: ConfidenceLevel;
  riskScore: number; // 0.0 to 100.0
  modelVersion: string;
  featureVersion?: string;
  isColdStart: boolean;
  disclaimer: string; // Mandatory explicit disclaimer stating estimation/forecast status
  timestamp: string;
}

export interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  mae?: number;
  rmse?: number;
  r2Score?: number;
  auc?: number;
  sampleCount: number;
  evaluationDate: string;
}

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  modelType: ModelType;
  target: ModelTarget;
  features: string[];
  status: ModelStatus;
  metrics: ModelMetrics;
  createdAt: string;
  deprecatedAt?: string;
}

export interface PredictiveOpportunity {
  productId: string;
  title: string;
  category: string;
  country: string;
  price: number;
  expectedProfit: number;
  expectedROI: number;
  cvrProbability: number;
  expectedEPC: number;
  opportunityScore: number;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  riskScore: number;
  positiveFactors: string[];
  negativeFactors: string[];
  disclaimer: string;
}

export interface PredictionExplanation {
  predictionId: string;
  target: string;
  predictedValue: number;
  lowerBound: number;
  upperBound: number;
  confidenceScore: number;
  positiveDrivers: Array<{ feature: string; weight: number; value: number }>;
  negativeDrivers: Array<{ feature: string; weight: number; value: number }>;
  dataSources: string[];
  llmSummary?: string;
}

export interface RecommendationItem {
  id: string;
  type: 'PRODUCT' | 'OFFER' | 'CHANNEL' | 'COUNTRY' | 'CONTENT' | 'SCHEDULE' | 'AFFILIATE_PROGRAM';
  entityId: string;
  score: number;
  confidence: number;
  expectedImpact: { profitDelta: number; roiDelta: number };
  risk: number;
  reason: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXECUTED' | 'EXPIRED';
  createdAt: string;
}

export interface AIUsageSummary {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUSD: number;
  aiROI: number;
  providerBreakdown: Record<string, { requests: number; cost: number }>;
}
