import { RewardSignal } from '../../types/learning/learning.types';

export interface CalibrationProposal {
  targetComponent: string;
  parameterName: string;
  previousValue: number;
  recommendedValue: number;
  improvementPercentage: number;
  reason: string;
}

export class Optimizer {
  public optimizeHyperparameters(rewards: RewardSignal[]): CalibrationProposal[] {
    if (!rewards || rewards.length === 0) return [];

    const proposals: CalibrationProposal[] = [];

    const positiveRewards = rewards.filter(r => r.isPositive);
    const negativeRewards = rewards.filter(r => !r.isPositive);

    const winRate = rewards.length > 0 ? positiveRewards.length / rewards.length : 0.5;

    // Proposal 1: Agent Consensus Divergence Threshold
    if (winRate < 0.6) {
      proposals.push({
        targetComponent: 'M13.AgentConsensusEngine',
        parameterName: 'disagreementThreshold',
        previousValue: 0.35,
        recommendedValue: 0.25, // tighter consensus required when win rate is low
        improvementPercentage: -28.5,
        reason: `Overall win rate is low (${(winRate * 100).toFixed(1)}%). Lowering disagreement threshold to enforce tighter consensus.`
      });
    }

    // Proposal 2: Minimum ROI Target Calibration
    const avgActualROI = rewards.reduce((acc, r) => acc + r.actualROI, 0) / rewards.length;
    const avgExpectedROI = rewards.reduce((acc, r) => acc + r.expectedROI, 0) / rewards.length;

    if (avgActualROI < avgExpectedROI) {
      const adjustment = Number(((avgActualROI / avgExpectedROI)).toFixed(4));
      proposals.push({
        targetComponent: 'M9.EPCPredictionModel',
        parameterName: 'roiMultiplier',
        previousValue: 1.0,
        recommendedValue: adjustment,
        improvementPercentage: Number(((adjustment - 1.0) * 100).toFixed(2)),
        reason: `Actual average ROI (${avgActualROI.toFixed(2)}) fell short of expected (${avgExpectedROI.toFixed(2)}). Applying calibration multiplier ${adjustment}.`
      });
    }

    return proposals;
  }
}
