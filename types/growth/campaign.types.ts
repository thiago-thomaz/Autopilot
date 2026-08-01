import {
  CampaignStrategy,
  GrowthCampaignStatus,
  GrowthExperimentType,
  GrowthExperimentStatus,
  GrowthTaskType,
  GrowthTaskPriority,
  GrowthTaskStatus,
  CampaignHealthLevel
} from '@prisma/client';

export interface CampaignConfig {
  id?: string;
  name: string;
  description?: string;
  objectiveId?: string;
  strategy: CampaignStrategy;
  productId?: string;
  offerId?: string;
  affiliateProgramId?: string;
  marketId?: string;
  language?: string;
  channel?: string;
  budget: number;
  startDate?: Date | string;
  endDate?: Date | string;
  priority?: string;
  expectedRevenue?: number;
  expectedProfit?: number;
  expectedROI?: number;
  confidence?: number;
  risk?: number;
}

export interface CampaignVariantConfig {
  id?: string;
  campaignId: string;
  contentId?: string;
  hook?: string;
  headline?: string;
  CTA?: string;
  creative?: string;
  language?: string;
  market?: string;
  channel?: string;
  status?: string;
  performance?: Record<string, any>;
}

export interface GrowthExperimentConfig {
  id?: string;
  campaignId: string;
  experimentType: GrowthExperimentType;
  hypothesis: string;
  controlVariantId?: string;
  treatmentVariantId?: string;
  minimumSample?: number;
  minimumDuration?: number;
  confidenceThreshold?: number;
  status?: GrowthExperimentStatus;
  winnerVariantId?: string;
}

export interface GrowthTaskConfig {
  id?: string;
  campaignId?: string;
  type: GrowthTaskType;
  priority: GrowthTaskPriority;
  status?: GrowthTaskStatus;
  dependencies?: string[];
  scheduledAt?: Date | string;
  completedAt?: Date | string;
  error?: string;
}

export interface CampaignHealthSummary {
  campaignId: string;
  healthScore: number;
  healthLevel: CampaignHealthLevel;
  ctrScore: number;
  cvrScore: number;
  profitScore: number;
  roiScore: number;
  recommendation: string;
}

export interface CampaignProposalConfig {
  id?: string;
  name: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  strategy: CampaignStrategy;
  objectives?: any[];
  markets?: string[];
  products?: string[];
  channels?: string[];
  budget: number;
  expectedProfit: number;
  risk: number;
  approved?: boolean;
  status?: string;
}
