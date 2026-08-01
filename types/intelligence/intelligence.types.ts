import {
  IntelligenceEventType,
  EvidenceConfidenceType,
  DecisionHierarchyLevel,
  DecisionActionType,
  DecisionStatusType,
  AgentType,
  ApprovalChannelType
} from '@prisma/client';

export type SystemAutonomyState = 'OBSERVE' | 'RECOMMEND' | 'SUPERVISED' | 'AUTONOMOUS';

export interface SignalEvent {
  id?: string;
  eventType: IntelligenceEventType;
  sourceModule: string; // M1 to M12
  entityType: string;
  entityId: string;
  payload: Record<string, any>;
  timestamp?: Date | string;
}

export interface IntelligenceContextState {
  id?: string;
  timestamp: Date | string;
  financialState: {
    netProfit: number;
    cashBalance: number;
    cashReserveStatus: string;
    profitMargin: number;
  };
  activeObjectives: any[];
  channelPerformance: Record<string, any>;
  marketConstraints: Record<string, any>;
  predictiveScores: Record<string, any>;
  activeRisksCount: number;
  autonomyMode: SystemAutonomyState;
}

export interface RiskEvaluationItem {
  id?: string;
  category: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: number;
  impact: number;
  score: number;
  mitigationAction: string;
}

export interface OpportunityEvaluationItem {
  id?: string;
  title: string;
  domain: string;
  expectedNetProfit: number;
  cvr: number;
  epc: number;
  riskScore: number;
  priorityScore: number;
  opportunityScore: number;
}
