import {
  AutonomyLevel,
  DecisionType,
  PolicyResult,
  DecisionStatus,
  ActionType,
  ActionStatus,
  RiskLevel,
  ApprovalStatus,
} from '@prisma/client';

export {
  AutonomyLevel,
  DecisionType,
  PolicyResult,
  DecisionStatus,
  ActionType,
  ActionStatus,
  RiskLevel,
  ApprovalStatus,
};

export interface DecisionPayload {
  scope: 'GLOBAL' | 'PRODUCT' | 'CHANNEL' | 'CAMPAIGN' | 'COUNTRY' | 'LANGUAGE';
  entityType: string;
  entityId: string;
  decisionType: DecisionType;
  reason: string;
  confidence: number;
  expectedImpact?: {
    profitDelta?: number;
    revenueDelta?: number;
    commissionDelta?: number;
    roiDelta?: number;
    conversionDelta?: number;
  };
  riskScore: number;
  priority: number;
  autonomyLevel?: AutonomyLevel;
  metadata?: Record<string, any>;
}

export interface ActionStep {
  stepIndex: number;
  actionType: ActionType;
  platform: string;
  accountId?: string;
  entityType: string;
  entityId: string;
  payload?: Record<string, any>;
  costEstimate?: number;
}

export interface ActionPlanBlueprint {
  decisionId: string;
  steps: ActionStep[];
  estimatedCost: number;
  estimatedDuration: number; // in seconds
  risk: RiskLevel;
  rollbackPlan?: ActionStep[];
  approvalRequired: Boolean;
}

export interface MetricSnapshot {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  commission: number;
  profit: number;
  roi: number;
  conversionRate: number;
  sampleSize: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface RiskFactor {
  code: string;
  name: string;
  weight: number;
  score: number;
  description: string;
}

export interface PolicyCheckResult {
  policyCode: string;
  allowed: boolean;
  result: PolicyResult;
  violations: string[];
}

export interface DataSufficiencyCheck {
  isSufficient: boolean;
  minimumSample: number;
  currentSample: number;
  missingMetric?: string;
  reason?: string;
}

export interface CostEstimate {
  apiCost: number;
  aiCost: number;
  messagingCost: number;
  totalCost: number;
  currency: string;
}

export interface AutomationSystemConfig {
  globalKillSwitch: boolean;
  circuitBreakerActive: boolean;
  simulationMode: boolean;
  shadowMode: boolean;
  currentAutonomyLevel: AutonomyLevel;
  dailyBudgetLimit: number;
  monthlyBudgetLimit: number;
  dailyLossLimit: number;
  minSampleImpressions: number;
  minSampleClicks: number;
  minSampleConversions: number;
  channelKillSwitches: Record<string, boolean>;
  campaignKillSwitches: Record<string, boolean>;
}

export interface BacktestResult {
  periodDays: number;
  decisionsEvaluated: number;
  simulatedProfitDelta: number;
  simulatedRoiDelta: number;
  accuracyRate: number;
  riskDistribution: Record<RiskLevel, number>;
}
