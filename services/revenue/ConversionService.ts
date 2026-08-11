import { prisma } from '../../lib/prisma';
import { Logger } from '../../lib/logger';
import { ConversionStatus, CommissionStatus } from '@prisma/client';

export interface CommissionReport {
  clickId?: string;
  subId?: string;
  externalOrderId: string;
  productId?: string;
  amount: number;
  commission: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  marketplace: string;
}

export class ConversionService {
  /**
   * Ingest a commission report from a marketplace (e.g. Amazon, Mercado Livre)
   */
  public static async ingestReport(report: CommissionReport) {
    try {
      // Find the click event to link it
      let clickEventId = null;
      if (report.clickId) {
        const click = await prisma.clickEvent.findUnique({
          where: { id: report.clickId }
        });
        if (click) clickEventId = click.id;
      }

      if (!clickEventId && report.subId) {
        const click = await prisma.clickEvent.findUnique({
          where: { id: report.subId }
        });
        if (click) clickEventId = click.id;
      }

      const conversionStatus: ConversionStatus =
        report.status === 'CONFIRMED' ? 'CONFIRMED' :
        report.status === 'CANCELLED' ? 'CANCELLED' : 'PENDING';

      const commissionStatus: CommissionStatus =
        report.status === 'CONFIRMED' ? 'APPROVED' :
        report.status === 'CANCELLED' ? 'REJECTED' : 'PENDING';

      // Upsert Conversion
      const conversion = await prisma.conversion.findFirst({
        where: { externalOrderId: report.externalOrderId }
      });

      let conversionId = conversion?.id;

      if (!conversion) {
        const newConversion = await prisma.conversion.create({
          data: {
            externalOrderId: report.externalOrderId,
            productId: report.productId || 'unknown',
            amount: report.amount,
            currency: report.currency,
            status: conversionStatus,
            clickEventId,
            convertedAt: new Date()
          }
        });
        conversionId = newConversion.id;
      } else {
        await prisma.conversion.update({
          where: { id: conversionId },
          data: {
            status: conversionStatus,
            clickEventId: clickEventId || conversion.clickEventId,
            amount: report.amount
          }
        });
      }

      // Upsert Commission
      if (conversionId) {
        const commission = await prisma.commission.findUnique({
          where: { conversionId }
        });

        if (!commission) {
          await prisma.commission.create({
            data: {
              conversionId,
              amount: report.commission,
              currency: report.currency,
              status: commissionStatus,
              paidAt: report.status === 'CONFIRMED' ? new Date() : null
            }
          });
        } else {
          await prisma.commission.update({
            where: { id: commission.id },
            data: {
              status: commissionStatus,
              amount: report.commission,
              paidAt: report.status === 'CONFIRMED' && !commission.paidAt ? new Date() : commission.paidAt
            }
          });
        }
      }

      Logger.info('CONVERSION_SERVICE', 'REPORT_INGESTED', `Relatório ingerido para a ordem ${report.externalOrderId}`);
      return { success: true, conversionId };
    } catch (error: any) {
      Logger.error('CONVERSION_SERVICE', 'INGEST_FAILED', `Falha ao ingerir relatório: ${error.message}`);
      throw error;
    }
  }
}
