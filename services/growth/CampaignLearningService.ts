export interface CampaignOutcome {
  campaignId: string;
  strategy: string;
  channel: string;
  market: string;
  netProfit: number;
  roi: number;
  topPerformingHook?: string;
  topPerformingCTA?: string;
  success: boolean;
}

export interface LearningInsight {
  channel: string;
  market: string;
  winningStrategy: string;
  recommendedHooks: string[];
  recommendedCTAs: string[];
  averageROI: number;
}

export class CampaignLearningService {
  private memory: Map<string, CampaignOutcome[]> = new Map();

  public recordOutcome(outcome: CampaignOutcome): void {
    const key = `${outcome.market}:${outcome.channel}`;
    const list = this.memory.get(key) || [];
    list.push(outcome);
    this.memory.set(key, list);
  }

  public getInsights(market: string, channel: string): LearningInsight | null {
    const key = `${market}:${channel}`;
    const outcomes = this.memory.get(key);
    if (!outcomes || outcomes.length === 0) return null;

    const totalROI = outcomes.reduce((acc, o) => acc + o.roi, 0);
    const avgROI = totalROI / outcomes.length;

    const successful = outcomes.filter((o) => o.success);
    const hooks = successful.map((s) => s.topPerformingHook).filter(Boolean) as string[];
    const ctas = successful.map((s) => s.topPerformingCTA).filter(Boolean) as string[];

    const strategyCounts: Record<string, number> = {};
    successful.forEach((s) => {
      strategyCounts[s.strategy] = (strategyCounts[s.strategy] || 0) + 1;
    });

    const winningStrategy = Object.keys(strategyCounts).sort(
      (a, b) => strategyCounts[b] - strategyCounts[a]
    )[0] || 'HARVEST';

    return {
      channel,
      market,
      winningStrategy,
      recommendedHooks: Array.from(new Set(hooks)).slice(0, 5),
      recommendedCTAs: Array.from(new Set(ctas)).slice(0, 5),
      averageROI: Number(avgROI.toFixed(2))
    };
  }
}
