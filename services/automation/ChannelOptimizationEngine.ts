import { MetricSnapshot, DecisionPayload, DecisionType } from '../../types/automation/automation.types';

export class ChannelOptimizationEngine {
  evaluateChannel(channelName: string, metrics: MetricSnapshot): DecisionPayload | null {
    if (metrics.roi < 0.5 && metrics.spend > 50) {
      return {
        scope: 'CHANNEL',
        entityType: 'Channel',
        entityId: channelName,
        decisionType: DecisionType.DECREASE_DISTRIBUTION,
        reason: `Channel ${channelName} underperforming with ROI ${metrics.roi.toFixed(2)}.`,
        confidence: 0.85,
        riskScore: 35,
        priority: 2,
      };
    }
    return null;
  }
}
