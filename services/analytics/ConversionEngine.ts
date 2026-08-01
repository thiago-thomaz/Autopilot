import { prisma } from '../../lib/prisma';
import { ConversionRecordStatus } from '@prisma/client';

export class ConversionEngine {
  public static async recordConversion(data: {
    orderReference: string;
    saleAmount: number;
    commissionAmount: number;
    currency?: string;
    trackingId?: string;
    status?: ConversionRecordStatus;
  }) {
    return await prisma.analyticsConversion.create({
      data: {
        orderReference: data.orderReference,
        saleAmount: data.saleAmount,
        commissionAmount: data.commissionAmount,
        currency: data.currency || 'BRL',
        commissionCurrency: data.currency || 'BRL',
        trackingId: data.trackingId,
        status: data.status || 'APPROVED',
      },
    });
  }
}
