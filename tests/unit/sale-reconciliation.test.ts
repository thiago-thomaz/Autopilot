import { describe, it, expect } from 'vitest';
import { SaleReconciliationEngine } from '../../services/analytics/SaleReconciliationEngine';

describe('SaleReconciliationEngine (Conciliação Financeira)', () => {
  it('deve realizar o pareamento de vendas reportadas com cliques internos', () => {
    const reported = [
      { orderId: 'ORD_1', amount: 500, commission: 45 },
      { orderId: 'ORD_2', amount: 200, commission: 18 },
    ];

    const internalClicks = [
      { trackingId: 'ORD_1', orderId: 'ORD_1' },
      { trackingId: 'ORD_99', orderId: 'ORD_99' },
    ];

    const res = SaleReconciliationEngine.reconcileSales(reported, internalClicks);
    expect(res.importedRecords).toBe(2);
    expect(res.matchedCount).toBe(1);
    expect(res.missingCount).toBe(1);
    expect(res.reconciliationRate).toBe(50.0);
  });
});
