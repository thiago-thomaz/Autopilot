export interface SaturationMetrics {
  campaignId: string;
  reachCount: number;
  frequency: number;
  audienceSize: number;
  historicalCTR: number[];
  historicalCVR: number[];
}

export interface SaturationReport {
  campaignId: string;
  saturationScore: number; // 0 to 1
  isSaturated: boolean;
  frequencyWarning: boolean;
  performanceDecayRate: number;
  recommendation: 'CONTINUE' | 'ROTATING_CREATIVES' | 'EXPAND_AUDIENCE' | 'PAUSE';
}

export class CampaignSaturationEngine {
  public analyzeSaturation(metrics: SaturationMetrics): SaturationReport {
    const { campaignId, reachCount, frequency, audienceSize, historicalCTR } = metrics;

    const marketPenetration = audienceSize > 0 ? reachCount / audienceSize : 0.5;
    const freqFactor = Math.min(1, frequency / 5); // Warning above 5x frequency
    const ctrDecay = historicalCTR.length >= 2
      ? (historicalCTR[0] - historicalCTR[historicalCTR.length - 1]) / Math.max(0.001, historicalCTR[0])
      : 0;

    const saturationScore = Math.min(1, marketPenetration * 0.4 + freqFactor * 0.4 + Math.max(0, ctrDecay) * 0.2);
    const isSaturated = saturationScore >= 0.75;
    const frequencyWarning = frequency > 4.5;

    let recommendation: 'CONTINUE' | 'ROTATING_CREATIVES' | 'EXPAND_AUDIENCE' | 'PAUSE' = 'CONTINUE';
    if (isSaturated) {
      recommendation = 'EXPAND_AUDIENCE';
    } else if (frequencyWarning) {
      recommendation = 'ROTATING_CREATIVES';
    }

    return {
      campaignId,
      saturationScore: Number(saturationScore.toFixed(4)),
      isSaturated,
      frequencyWarning,
      performanceDecayRate: Number(ctrDecay.toFixed(4)),
      recommendation
    };
  }
}
