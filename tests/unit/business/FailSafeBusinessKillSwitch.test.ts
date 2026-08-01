import { describe, it, expect } from 'vitest';
import { BusinessOperatingSystem } from '../../../services/business/BusinessOperatingSystem';

describe('FailSafeBusinessKillSwitch', () => {
  it('immediately halts Business OS executive cycle when GLOBAL_BUSINESS_KILL_SWITCH is activated', () => {
    const bos = new BusinessOperatingSystem();
    bos.setGlobalKillSwitch(true);

    const cycle = bos.runExecutiveCycle({ commissionRevenue: 50000 });

    expect(cycle.status).toBe('KILL_SWITCH');
    expect(cycle.executiveDRE).toBeNull();
    expect(cycle.alerts.some((a) => a.type === 'GLOBAL_BUSINESS_KILL_SWITCH')).toBe(true);
  });
});
