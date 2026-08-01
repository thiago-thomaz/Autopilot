import {
  DecisionHierarchyLevel,
  DecisionActionType,
  DecisionStatusType,
  ApprovalChannelType
} from '@prisma/client';

export interface DecisionPayload {
  id?: string;
  title: string;
  level: DecisionHierarchyLevel; // LEVEL_1_OPERATIONAL, LEVEL_2_TACTICAL, LEVEL_3_STRATEGIC
  actionType: DecisionActionType;
  entityType: string;
  entityId: string;
  reason: string; // The "WHY"
  confidenceScore: number;
  expectedProfitImpact: number;
  expectedRiskScore: number;
  priorityScore: number;
  idempotencyKey: string;
  status: DecisionStatusType;
  requiresHumanApproval: boolean;
  metadata?: Record<string, any>;
}

export interface ScenarioSimulationResult {
  scenarioName: string; // Base, Best, Worst, Expected
  projectedNetProfit: number;
  projectedROI: number;
  probability: number;
  riskFactor: number;
}

export interface ActionPlanStep {
  stepOrder: number;
  actionName: string;
  targetModule: string; // M11, M12, n8n
  payload: Record<string, any>;
  costEstimate: number;
  rollbackStep?: Record<string, any>;
}
