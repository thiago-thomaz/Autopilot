import { SaleReconciliationEngine } from './SaleReconciliationEngine';
import { prisma } from '../../lib/prisma';

export class AffiliateReportImporter {
  /**
   * Importa relatórios CSV/JSON de vendas de afiliados e executa a conciliação financeira.
   */
  public static async importReport(rows: Array<{ orderId: string; amount: number; commission: number; date?: string }>) {
    const internalClicks = await prisma.analyticsClick.findMany({
      take: 500,
      select: { trackingId: true },
    });

    const reconciliation = SaleReconciliationEngine.reconcileSales(
      rows.map((r) => ({ orderId: r.orderId, amount: r.amount, commission: r.commission })),
      internalClicks.map((c) => ({ trackingId: c.trackingId, orderId: c.trackingId }))
    );

    for (const r of rows) {
      await prisma.saleRecord.upsert({
        where: {
          externalOrderId_affiliateProgramId: {
            externalOrderId: r.orderId,
            affiliateProgramId: 'amazon-brasil',
          },
        },
        update: {
          grossAmount: r.amount,
          netAmount: r.amount,
          commissionAmount: r.commission,
          reconciliationStatus: reconciliation.matchedCount > 0 ? 'MATCHED' : 'UNRESOLVED',
        },
        create: {
          externalOrderId: r.orderId,
          affiliateProgramId: 'amazon-brasil',
          grossAmount: r.amount,
          netAmount: r.amount,
          commissionAmount: r.commission,
          reconciliationStatus: reconciliation.matchedCount > 0 ? 'MATCHED' : 'UNRESOLVED',
        },
      });
    }

    return reconciliation;
  }
}
