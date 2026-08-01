import {
  BusinessModelType,
  RiskToleranceLevel,
  BusinessObjectiveType,
  BusinessObjectivePeriod,
  BusinessObjectiveStatus,
  BusinessRiskCategory,
  BusinessLessonType,
  BusinessActorType
} from '@prisma/client';

export type BusinessAutomationMode = 'SHADOW' | 'PAPER' | 'SUPERVISED' | 'AUTONOMOUS';

export interface BusinessProfileConfig {
  id?: string;
  name: string;
  description?: string;
  baseCurrency: string;
  baseCountry: string;
  businessModel: BusinessModelType;
  riskTolerance: RiskToleranceLevel;
  growthMode: string;
}

export interface BusinessObjectiveConfig {
  id?: string;
  name: string;
  type: BusinessObjectiveType;
  period: BusinessObjectivePeriod;
  targetValue: number;
  currentValue?: number;
  deadline?: Date | string;
  requiredRunRate?: number;
  status?: BusinessObjectiveStatus;
}

export interface GoalGapAnalysis {
  objectiveId: string;
  objectiveName: string;
  targetValue: number;
  currentValue: number;
  gap: number;
  daysRemaining: number;
  requiredDailyRunRate: number;
  currentDailyRunRate: number;
  status: BusinessObjectiveStatus;
  onTrack: boolean;
}

export interface DiversificationAnalysis {
  diversificationScore: number; // 0 to 100
  productConcentration: number; // % top product
  marketConcentration: number; // % top market
  channelConcentration: number; // % top channel
  affiliateProgramConcentration: number; // % top affiliate program
  hasConcentrationRisk: boolean; // true if any concentration > 50%
  highestRiskFactor: string;
}

export interface BusinessDiagnosticReport {
  overallHealthScore: number; // 0 to 100
  financialHealth: 'EXCELLENT' | 'HEALTHY' | 'WARNING' | 'CRITICAL';
  diversificationStatus: 'BALANCED' | 'CONCENTRATED' | 'HIGH_RISK';
  cashReserveStatus: 'NORMAL' | 'WARNING' | 'SAFETY_LOCK';
  topRecommendations: string[];
  activeRisksCount: number;
}
