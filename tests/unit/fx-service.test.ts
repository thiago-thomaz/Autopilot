import { describe, it, expect } from 'vitest';
import { FXService } from '../../services/global/FXService';

describe('FXService Unit Tests', () => {
  const fxService = new FXService();

  it('should convert currency with correct exchange rate precision', () => {
    const result = fxService.convertCurrency(100, 'USD', 'BRL');
    expect(result.amountTo).toBe(525.0);
    expect(result.exchangeRate).toBe(5.25);
    expect(result.isStale).toBe(false);
  });

  it('should fallback cleanly with isStale = true if rate is unavailable', () => {
    const result = fxService.convertCurrency(100, 'UNKNOWN_CURRENCY', 'USD');
    expect(result.amountTo).toBe(100);
    expect(result.isStale).toBe(true);
  });
});
