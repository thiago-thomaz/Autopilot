import { describe, it, expect } from 'vitest';
import { AttributionEngine } from '../../services/analytics/AttributionEngine';

describe('AttributionEngine (Atribuição Multi-Touch sem Duplicação)', () => {
  const touchpoints = [
    { id: 'tp1', timestamp: new Date(Date.now() - 3000), channel: 'INSTAGRAM' },
    { id: 'tp2', timestamp: new Date(Date.now() - 2000), channel: 'TELEGRAM' },
    { id: 'tp3', timestamp: new Date(Date.now() - 1000), channel: 'OWN_WEBSITE' },
  ];

  it('deve atribuir 100% do crédito ao último clique no modelo LAST_CLICK', () => {
    const res = AttributionEngine.attributeConversion('c1', 100.0, 80.0, touchpoints, 'LAST_CLICK');
    expect(res.touchpoints[2].credit).toBe(1.0);
    expect(res.touchpoints[2].attributedCommission).toBe(100.0);
    expect(res.touchpoints[0].credit).toBe(0.0);
  });

  it('deve atribuir 100% do crédito ao primeiro clique no modelo FIRST_CLICK', () => {
    const res = AttributionEngine.attributeConversion('c1', 100.0, 80.0, touchpoints, 'FIRST_CLICK');
    expect(res.touchpoints[0].credit).toBe(1.0);
    expect(res.touchpoints[0].attributedCommission).toBe(100.0);
  });

  it('deve dividir o crédito igualmente no modelo LINEAR', () => {
    const res = AttributionEngine.attributeConversion('c1', 90.0, 60.0, touchpoints, 'LINEAR');
    expect(res.touchpoints[0].credit).toBeCloseTo(0.3333, 3);
    expect(res.touchpoints[1].credit).toBeCloseTo(0.3333, 3);
    expect(res.touchpoints[2].credit).toBeCloseTo(0.3333, 3);

    const totalAttributed = res.touchpoints.reduce((acc, tp) => acc + tp.attributedCommission, 0);
    expect(totalAttributed).toBeCloseTo(90.0, 1);
  });

  it('deve priorizar início e fim no modelo POSITION_BASED (40% / 20% / 40%)', () => {
    const res = AttributionEngine.attributeConversion('c1', 100.0, 80.0, touchpoints, 'POSITION_BASED');
    expect(res.touchpoints[0].credit).toBe(0.4);
    expect(res.touchpoints[1].credit).toBe(0.2);
    expect(res.touchpoints[2].credit).toBe(0.4);
  });
});
