import { IntelligenceContextState } from '../../types/intelligence/intelligence.types';

export class ContextEngine {
  public buildContext(
    financials: any = {},
    objectives: any[] = [],
    channelPerf: Record<string, any> = {},
    predictiveScores: Record<string, any> = {},
    autonomyMode: 'OBSERVE' | 'RECOMMEND' | 'SUPERVISED' | 'AUTONOMOUS' = 'SUPERVISED'
  ): IntelligenceContextState {
    return {
      timestamp: new Date(),
      financialState: {
        netProfit: Number(financials.netProfit || 0),
        cashBalance: Number(financials.cashBalance || 5000),
        cashReserveStatus: financials.cashReserveStatus || 'NORMAL',
        profitMargin: Number(financials.profitMargin || 0)
      },
      activeObjectives: objectives,
      channelPerformance: channelPerf,
      marketConstraints: { baseCurrency: 'USD', maxDailySpend: 500 },
      predictiveScores,
      activeRisksCount: financials.cashReserveStatus === 'SAFETY_LOCK' ? 1 : 0,
      autonomyMode
    };
  }
}
