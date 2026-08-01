export type ExpansionStage = 'DISCOVERY' | 'RESEARCH' | 'TEST' | 'VALIDATE' | 'EXPAND' | 'SCALE' | 'EXIT';

export interface ExpansionState {
  country: string;
  stage: ExpansionStage;
  testBudgetUSD: number;
  historicalProfitUSD: number;
  autoExitTriggered: boolean;
}

export class ExpansionEngine {
  public evaluateStageTransition(
    country: string,
    currentStage: ExpansionStage,
    testProfitUSD: number,
    consecutiveLossDays: number = 0
  ): ExpansionState {
    let nextStage: ExpansionStage = currentStage;
    let autoExit = false;

    if (consecutiveLossDays >= 14 || testProfitUSD < -50) {
      nextStage = 'EXIT';
      autoExit = true;
    } else if (currentStage === 'TEST' && testProfitUSD > 20) {
      nextStage = 'VALIDATE';
    } else if (currentStage === 'VALIDATE' && testProfitUSD > 100) {
      nextStage = 'EXPAND';
    } else if (currentStage === 'EXPAND' && testProfitUSD > 500) {
      nextStage = 'SCALE';
    }

    return {
      country,
      stage: nextStage,
      testBudgetUSD: nextStage === 'TEST' ? 25.0 : nextStage === 'EXPAND' ? 250.0 : 1000.0,
      historicalProfitUSD: Number(testProfitUSD.toFixed(2)),
      autoExitTriggered: autoExit
    };
  }
}
