import { describe, it, expect } from 'vitest';
import { AutonomyGuardrailEngine } from '../../../services/growth/AutonomyGuardrailEngine';

describe('AutonomyGuardrailEngine', () => {
  it('requires manual approval for HIGH risk actions under SUPERVISED mode', () => {
    const engine = new AutonomyGuardrailEngine();
    engine.automationLevel = 'SUPERVISED';

    const result = engine.evaluateAction({
      actionName: 'SCALE_CAMPAIGN_20',
      riskLevel: 'HIGH',
      proposedBudget: 500
    });

    expect(result.requiresManualApproval).toBe(true);
  });

  it('triggers KillSwitchActiveError when global kill switch is active', () => {
    const engine = new AutonomyGuardrailEngine();
    engine.setGlobalKillSwitch(true);

    expect(() =>
      engine.evaluateAction({ actionName: 'TEST', riskLevel: 'LOW' })
    ).toThrow('GLOBAL Kill Switch is ACTIVE');
  });
});
