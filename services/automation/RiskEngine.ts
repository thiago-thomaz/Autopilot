import { RiskLevel, AutonomyLevel, RiskFactor } from '../../types/automation/automation.types';
import { HighRiskBlockedError } from '../../types/automation/automation.errors';

export class RiskEngine {
  evaluateRisk(decisionType: string, expectedSpend = 0, targetAudienceSize = 1000): {
    riskScore: number;
    riskLevel: RiskLevel;
    factors: RiskFactor[];
  } {
    const factors: RiskFactor[] = [];
    let baseScore = 20;

    // Evaluate based on decision type impact
    if (['STOP_UNPROFITABLE', 'PAUSE', 'DECREASE_PRIORITY'].includes(decisionType)) {
      baseScore = 15;
      factors.push({
        code: 'LOW_IMPACT_PAUSE',
        name: 'Pause/Decrease Action',
        weight: 1.0,
        score: 15,
        description: 'Pausing or lowering priority has low financial risk',
      });
    } else if (['RECREATE_CONTENT', 'REFRESH_CONTENT', 'CHANGE_SCHEDULE'].includes(decisionType)) {
      baseScore = 30;
      factors.push({
        code: 'MEDIUM_IMPACT_CONTENT',
        name: 'Content Optimization',
        weight: 1.0,
        score: 30,
        description: 'Modifying content or schedule carries moderate engagement risk',
      });
    } else if (['SCALE_WINNER', 'INCREASE_DISTRIBUTION', 'CHANGE_COUNTRY', 'CHANGE_PRODUCT'].includes(decisionType)) {
      baseScore = 75;
      factors.push({
        code: 'HIGH_IMPACT_SCALE',
        name: 'Scale/Distribution Action',
        weight: 1.5,
        score: 75,
        description: 'Scaling budget or distribution carries high financial and reputation risk',
      });
    }

    // Spend factor
    if (expectedSpend > 500) {
      baseScore += 20;
      factors.push({
        code: 'HIGH_SPEND',
        name: 'Significant Spend',
        weight: 1.2,
        score: 20,
        description: `Action cost ($${expectedSpend}) is significant`,
      });
    }

    const riskScore = Math.min(100, Math.max(0, Math.round(baseScore)));

    let riskLevel: RiskLevel = RiskLevel.LOW;
    if (riskScore >= 80) {
      riskLevel = RiskLevel.CRITICAL;
    } else if (riskScore >= 60) {
      riskLevel = RiskLevel.HIGH;
    } else if (riskScore >= 35) {
      riskLevel = RiskLevel.MEDIUM;
    }

    return {
      riskScore,
      riskLevel,
      factors,
    };
  }

  isAllowedForAutonomyLevel(riskLevel: RiskLevel, autonomyLevel: AutonomyLevel): boolean {
    switch (autonomyLevel) {
      case AutonomyLevel.LEVEL_0_OBSERVE:
      case AutonomyLevel.LEVEL_1_RECOMMEND:
        return false; // Require manual approval for all actions

      case AutonomyLevel.LEVEL_2_AUTO_LOW_RISK:
        return riskLevel === RiskLevel.LOW;

      case AutonomyLevel.LEVEL_3_AUTO_MEDIUM_RISK:
        return riskLevel === RiskLevel.LOW || riskLevel === RiskLevel.MEDIUM;

      case AutonomyLevel.LEVEL_4_SUPERVISED_HIGH_IMPACT:
        return riskLevel !== RiskLevel.CRITICAL;

      case AutonomyLevel.LEVEL_5_FULL_AUTONOMY_ALLOWED_ACTIONS:
        return true;

      default:
        return false;
    }
  }

  assertAutonomy(riskLevel: RiskLevel, autonomyLevel: AutonomyLevel) {
    if (!this.isAllowedForAutonomyLevel(riskLevel, autonomyLevel)) {
      throw new HighRiskBlockedError(
        `Action with risk level ${riskLevel} cannot be auto-executed under autonomy level ${autonomyLevel}. Approval required.`,
        { riskLevel, autonomyLevel }
      );
    }
  }
}
