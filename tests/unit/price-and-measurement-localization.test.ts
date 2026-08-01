import { describe, it, expect } from 'vitest';
import { FXService } from '../../services/global/FXService';
import { PriceLocalizationEngine } from '../../services/global/PriceLocalizationEngine';
import { MeasurementLocalizationEngine } from '../../services/global/MeasurementLocalizationEngine';

describe('Price & Measurement Localization Unit Tests', () => {
  const fxService = new FXService();
  const priceEngine = new PriceLocalizationEngine(fxService);
  const unitEngine = new MeasurementLocalizationEngine();

  it('should apply psychological pricing (.99 in USD, zero-decimal in JPY)', () => {
    const usdRes = priceEngine.localizePrice(20.0, 'USD', 'USD');
    expect(usdRes.localizedPrice).toBe(20.99);

    const jpyRes = priceEngine.localizePrice(10.0, 'USD', 'JPY');
    expect(jpyRes.localizedPrice).toBe(1550); // zero decimal
  });

  it('should convert units between metric and imperial based on target country', () => {
    const kgToLb = unitEngine.convertUnit(5.0, 'kg', 'US');
    expect(kgToLb.convertedValue).toBe(11.0);
    expect(kgToLb.convertedUnit).toBe('lbs');

    const cmToInch = unitEngine.convertUnit(10.0, 'cm', 'US');
    expect(cmToInch.convertedValue).toBe(3.9);
    expect(cmToInch.convertedUnit).toBe('inches');
  });
});
