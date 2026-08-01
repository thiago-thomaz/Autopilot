import { ReconciliationReport } from '../../types/analytics/analytics.types';

export class SaleReconciliationEngine {
  /**
   * Cruzamento de vendas reportadas pelas redes parceiras com os cliques internos.
   */
  public static reconcileSales(
    reportedSales: Array<{ orderId: string; amount: number; commission: number }>,
    internalClicks: Array<{ trackingId: string; orderId?: string }>
  ): ReconciliationReport {
    let matchedCount = 0;
    let missingCount = 0;
    let mismatchCount = 0;

    for (const sale of reportedSales) {
      const match = internalClicks.find((c) => c.orderId === sale.orderId || c.trackingId === sale.orderId);
      if (match) {
        matchedCount++;
      } else {
        missingCount++;
      }
    }

    const total = reportedSales.length;
    const reconciliationRate = total > 0 ? Number(((matchedCount / total) * 100).toFixed(2)) : 100;

    return {
      importedRecords: total,
      matchedCount,
      missingCount,
      mismatchCount,
      reconciliationRate,
    };
  }
}
