export type KnowledgeType = 'PATTERN' | 'RULE' | 'STRATEGY' | 'INSIGHT' | 'RISK' | 'PLAYBOOK';

export type KnowledgeStatus = 'NEW' | 'VALIDATED' | 'PROCESSED' | 'REJECTED' | 'ARCHIVED';

export type LearningQueuePriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'HIGH' | 'MEDIUM' | 'LOW' | 'BACKGROUND';

export type CalibrationTargetModule = 'M9' | 'M13';

export interface LearningEventInput {
  id?: string;
  source: string;
  entityType: string;
  entityId: string;
  decisionId?: string;
  campaignId?: string;
  experimentId?: string;
  market?: string;
  country?: string;
  language?: string;
  channel?: string;
  metrics: Record<string, number | string | boolean | null>;
  context?: Record<string, any>;
  confidenceScore?: number;
  qualityScore?: number;
  priority?: LearningQueuePriority;
}

export interface LearningEvent {
  id: string;
  timestamp: Date | string;
  source: string;
  entityType: string;
  entityId: string;
  decisionId?: string | null;
  campaignId?: string | null;
  experimentId?: string | null;
  market?: string | null;
  country?: string | null;
  language?: string | null;
  channel?: string | null;
  metrics: Record<string, any>;
  context: Record<string, any>;
  confidenceScore: number;
  qualityScore: number;
  status: KnowledgeStatus;
  createdAt: Date | string;
}

export interface DiscoveredKnowledgeInput {
  id?: string;
  knowledgeType: KnowledgeType;
  title: string;
  description: string;
  confidence?: number;
  confidenceInterval?: { lower: number; upper: number };
  importance?: number;
  decayFactor?: number;
  evidence?: Record<string, any>;
  sampleSize?: number;
  market?: string;
  country?: string;
  language?: string;
  channel?: string;
  validFrom?: Date | string;
  validUntil?: Date | string;
  version?: number;
}

export interface DiscoveredKnowledge {
  id: string;
  knowledgeType: KnowledgeType;
  title: string;
  description: string;
  confidence: number;
  confidenceInterval?: { lower: number; upper: number } | null;
  importance: number;
  quality: number;
  reliability: number;
  sampleSize: number;
  decayFactor: number;
  evidence: Record<string, any>;
  market?: string | null;
  country?: string | null;
  language?: string | null;
  channel?: string | null;
  version: number;
  status: KnowledgeStatus;
  validFrom: Date | string;
  validUntil?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface KnowledgeVersion {
  id: string;
  knowledgeId: string;
  version: number;
  delta: Record<string, any>;
  previousConfidence: number;
  newConfidence: number;
  reason: string;
  createdAt: Date | string;
}

export interface ModelCalibrationRecord {
  id: string;
  modelId: string;
  targetModule: CalibrationTargetModule;
  previousMetric: number;
  calibratedMetric: number;
  adjustmentFactor: number;
  reason?: string;
  appliedAt: Date | string;
}

export interface RewardSignal {
  decisionId: string;
  entityId: string;
  entityType: string;
  actualROI: number;
  expectedROI: number;
  actualNetProfit: number;
  expectedNetProfit: number;
  rewardValue: number; // Normalized -1.0 to +1.0
  isPositive: boolean;
  variance: number;
  calculatedAt: Date | string;
}

export interface PatternResult {
  patternId: string;
  name: string;
  clusterVariables: string[];
  associatedMetric: string;
  performanceLiftRatio: number;
  confidence: number;
  sampleSize: number;
  supportingEvents: string[];
}

export interface RuleExtractionResult {
  ruleId: string;
  condition: string;
  actionRecommendation: string;
  confidence: number;
  isValid: boolean;
  contradictingEvidenceCount: number;
  supportingEvidenceCount: number;
}

export interface FeedbackInput {
  source: 'HUMAN' | 'AGENT' | 'AUTOMATED';
  entityId: string;
  entityType: string;
  decisionId?: string;
  score: number; // -1 to +1 or 0 to 100
  comment?: string;
  agentId?: string;
  context?: Record<string, any>;
}
