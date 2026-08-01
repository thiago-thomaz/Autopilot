import {
  GrowthObjectiveType,
  GrowthObjectivePriority,
  CampaignStrategy,
  GrowthCampaignStatus,
  GrowthExperimentType,
  GrowthExperimentStatus,
  GrowthTaskType,
  GrowthTaskPriority,
  GrowthTaskStatus,
  BudgetScope,
  CampaignHealthLevel,
  GrowthPeriod
} from '@prisma/client';

export type AutomationLevel = 'MANUAL' | 'ASSISTED' | 'SUPERVISED' | 'AUTONOMOUS';
export type GrowthAutomationLevel = AutomationLevel;

export interface GrowthObjectiveConfig {
  id?: string;
  name: string;
  description?: string;
  type: GrowthObjectiveType;
  targetValue: number;
  currentValue?: number;
  deadline?: Date | string;
  priority: GrowthObjectivePriority;
  status?: string;
}

export interface TrueProfitBreakdown {
  grossCommission: number;
  refunds: number;
  reversals: number;
  aiCosts: number;
  contentCosts: number;
  localizationCosts: number;
  publicationCosts: number;
  messagingCosts: number;
  infrastructureCosts: number;
  totalCosts: number;
  netProfit: number;
  roi: number;
  currency: string;
}

export interface MarginalReturnResult {
  campaignId: string;
  currentBudget: number;
  proposedBudgetDelta: number;
  expectedProfitDelta: number;
  marginalReturnRatio: number; // Delta Profit / Delta Budget
  saturationLevel: number; // 0 to 1
  recommendation: 'SCALE' | 'HOLD' | 'REDUCE' | 'PAUSE';
}

export interface BudgetReserveConfig {
  operationalReserve: number;
  experimentalReserve: number;
  emergencyReserve: number;
}

export interface GrowthBudgetSummary {
  scope: BudgetScope;
  scopeId: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  reserves: BudgetReserveConfig;
  activeCampaignsCount: number;
}

export interface GrowthGuardrailCheckResult {
  passed: boolean;
  actionRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  automationLevel: GrowthAutomationLevel;
  shadowModeActive: boolean;
  killSwitchTriggered: boolean;
  requiresManualApproval: boolean;
  reasons: string[];
}

export interface FraudDetectionResult {
  isSuspicious: boolean;
  fraudScore: number; // 0 - 100
  signals: {
    clickSpike: boolean;
    conversionAnomaly: boolean;
    botPattern: boolean;
    duplicateIPRate: number;
  };
  recommendedAction: 'ALLOW' | 'FLAG' | 'PAUSE_CAMPAIGN' | 'BLOCK_AFFILIATE';
}

export interface SimulationResult {
  scenario: 'CONSERVATIVE' | 'BASE' | 'AGGRESSIVE';
  iterations: number;
  expectedRevenue: number;
  expectedProfit: number;
  expectedROI: number;
  probabilityOfProfitability: number;
  downsideRisk: number;
  confidenceInterval: [number, number];
}
