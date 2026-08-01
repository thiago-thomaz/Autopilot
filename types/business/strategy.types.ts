import { StrategicHorizon } from '@prisma/client';

export interface StrategicPlanConfig {
  id?: string;
  horizon: StrategicHorizon;
  objectives: string[];
  targetMarkets: string[];
  targetCategories: string[];
  budgetAllocation: Record<string, number>;
  riskStrategy: Record<string, any>;
  version: number;
}

export interface TradeoffOption {
  name: string;
  expectedProfitImpact: number;
  expectedRiskDelta: number;
  timeToImpactDays: number;
  pros: string[];
  cons: string[];
}

export interface TradeoffAnalysisResult {
  decisionContext: string;
  recommendedOption: TradeoffOption;
  alternativeOption: TradeoffOption;
  rationale: string;
}

export interface ExecutiveBriefingReport {
  date: Date | string;
  headline: string;
  kpiSummary: {
    grossRevenue: number;
    netProfit: number;
    profitMargin: number;
    roi: number;
    cashBalance: number;
  };
  goalProgressSummary: string;
  criticalAlerts: string[];
  topStrategicActions: string[];
}
