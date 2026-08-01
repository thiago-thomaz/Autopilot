import { describe, it, expect } from 'vitest';
import { CashReserveManager } from '../../../services/business/CashReserveManager';

describe('CashReserveManager', () => {
  const manager = new CashReserveManager();

  it('triggers SAFETY_LOCK status when current cash balance drops below minimum threshold', () => {
    const status = manager.updateBalance(1500); // Below 2000 minimum
    expect(status.status).toBe('SAFETY_LOCK');
    expect(manager.isSafetyLockActive()).toBe(true);
  });

  it('returns NORMAL status when cash balance is healthy', () => {
    const status = manager.updateBalance(5000);
    expect(status.status).toBe('NORMAL');
    expect(manager.isSafetyLockActive()).toBe(false);
  });
});
