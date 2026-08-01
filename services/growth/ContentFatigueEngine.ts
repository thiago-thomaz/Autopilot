export interface ContentFatigueMetrics {
  contentId: string;
  impressions: number;
  clicks: number;
  daysActive: number;
  ctrHistory: number[];
}

export interface ContentFatigueReport {
  contentId: string;
  fatigueScore: number; // 0 to 1
  isFatigued: boolean;
  recommendedAction: 'KEEP' | 'REFRESH_HOOK' | 'REPLACE_CREATIVE' | 'RETIRE';
}

export class ContentFatigueEngine {
  public detectFatigue(metrics: ContentFatigueMetrics): ContentFatigueReport {
    const { contentId, impressions, daysActive, ctrHistory } = metrics;

    const ageFactor = Math.min(1, daysActive / 30);
    const volumeFactor = Math.min(1, impressions / 50000);

    let ctrDropRate = 0;
    if (ctrHistory.length >= 2) {
      const initialCTR = ctrHistory[0];
      const currentCTR = ctrHistory[ctrHistory.length - 1];
      ctrDropRate = initialCTR > 0 ? (initialCTR - currentCTR) / initialCTR : 0;
    }

    const fatigueScore = Math.min(1, ageFactor * 0.3 + volumeFactor * 0.3 + Math.max(0, ctrDropRate) * 0.4);
    const isFatigued = fatigueScore >= 0.7;

    let recommendedAction: 'KEEP' | 'REFRESH_HOOK' | 'REPLACE_CREATIVE' | 'RETIRE' = 'KEEP';
    if (fatigueScore > 0.85) {
      recommendedAction = 'RETIRE';
    } else if (fatigueScore >= 0.7) {
      recommendedAction = 'REPLACE_CREATIVE';
    } else if (fatigueScore >= 0.5) {
      recommendedAction = 'REFRESH_HOOK';
    }

    return {
      contentId,
      fatigueScore: Number(fatigueScore.toFixed(4)),
      isFatigued,
      recommendedAction
    };
  }
}
