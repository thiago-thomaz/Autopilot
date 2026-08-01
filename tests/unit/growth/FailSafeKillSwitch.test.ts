import { describe, it, expect } from 'vitest';
import { AutonomousGrowthEngine } from '../../../services/growth/AutonomousGrowthEngine';

describe('FailSafeKillSwitch', () => {
  it('immediately halts autonomous growth loop when GLOBAL_KILL_SWITCH is activated', async () => {
    const engine = new AutonomousGrowthEngine();
    engine.guardrails.setGlobalKillSwitch(true);

    const result = await engine.runGrowthLoop([
      { productId: 'p1', productTitle: 'Test Product', opportunityScore: 90, expectedProfit: 100, expectedROI: 50, recommendedChannel: 'INSTAGRAM', recommendedLanguage: 'pt-BR', recommendedMarket: 'BR' }
    ]);

    expect(result.status).toBe('KILL_SWITCH');
    expect(result.allocatedBudget).toBe(0);
    expect(result.decisionsMade).toBe(0);
  });
});
