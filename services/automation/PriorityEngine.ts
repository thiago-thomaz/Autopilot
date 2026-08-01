import { DecisionPayload } from '../../types/automation/automation.types';

export class PriorityEngine {
  rankDecisions(decisions: DecisionPayload[]): DecisionPayload[] {
    return decisions.sort((a, b) => {
      // Primary: Priority number (0 = urgent, 5 = lowest)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      // Secondary: Expected profit impact
      const aImpact = a.expectedImpact?.profitDelta ?? 0;
      const bImpact = b.expectedImpact?.profitDelta ?? 0;
      return bImpact - aImpact;
    });
  }
}
