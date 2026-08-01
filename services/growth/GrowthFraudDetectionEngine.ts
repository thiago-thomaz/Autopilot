import { FraudDetectionResult } from '../../types/growth/growth.types';

export interface TrafficTelemetry {
  campaignId: string;
  totalClicks: number;
  totalConversions: number;
  uniqueIPs: number;
  avgClickTimeMs: number;
  duplicateIPRate: number;
}

export class GrowthFraudDetectionEngine {
  public analyzeTelemetry(data: TrafficTelemetry): FraudDetectionResult {
    const { totalClicks, totalConversions, uniqueIPs, avgClickTimeMs, duplicateIPRate } = data;

    const cvr = totalClicks > 0 ? totalConversions / totalClicks : 0;
    const clickSpike = totalClicks > 10000 && cvr < 0.001;
    const conversionAnomaly = cvr > 0.5 && totalClicks > 50; // Suspect instant conversion bot
    const botPattern = avgClickTimeMs < 100; // Human clicks take > 100ms
    const highDuplicateIP = duplicateIPRate > 0.4;

    let fraudScore = 0;
    if (clickSpike) fraudScore += 30;
    if (conversionAnomaly) fraudScore += 40;
    if (botPattern) fraudScore += 30;
    if (highDuplicateIP) fraudScore += 20;

    fraudScore = Math.min(100, fraudScore);
    const isSuspicious = fraudScore >= 50;

    let recommendedAction: 'ALLOW' | 'FLAG' | 'PAUSE_CAMPAIGN' | 'BLOCK_AFFILIATE' = 'ALLOW';
    if (fraudScore >= 80) {
      recommendedAction = 'PAUSE_CAMPAIGN';
    } else if (fraudScore >= 50) {
      recommendedAction = 'FLAG';
    }

    return {
      isSuspicious,
      fraudScore,
      signals: {
        clickSpike,
        conversionAnomaly,
        botPattern,
        duplicateIPRate
      },
      recommendedAction
    };
  }
}
