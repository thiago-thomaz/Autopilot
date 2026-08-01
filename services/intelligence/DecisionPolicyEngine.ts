import { DecisionPayload } from '../../types/intelligence/decision.types';

export class DecisionPolicyEngine {
  public validateDecision(decision: DecisionPayload, cashReserveStatus: string = 'NORMAL', killSwitchActive: boolean = false): { isAllowed: boolean; violationReason?: string } {
    if (killSwitchActive) {
      return { isAllowed: false, violationReason: 'GLOBAL_KILL_SWITCH is ACTIVE' };
    }

    if (cashReserveStatus === 'SAFETY_LOCK' && decision.expectedProfitImpact < 0) {
      return { isAllowed: false, violationReason: 'CASH_SAFETY_LOCK active: Spending actions prohibited' };
    }

    if (decision.confidenceScore < 0.5) {
      return { isAllowed: false, violationReason: 'Confidence score below minimum 0.50 threshold' };
    }

    return { isAllowed: true };
  }
}
