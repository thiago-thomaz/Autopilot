import { prisma } from '../../lib/prisma';

export class CommissionEngine {
  public static async recordCommission(data: { saleId?: string; amount: number; currency?: string; status?: any }) {
    return await prisma.commissionRecord.create({
      data: {
        saleId: data.saleId,
        amount: data.amount,
        currency: data.currency || 'BRL',
        status: data.status || 'APPROVED',
        approvedAt: new Date(),
      },
    });
  }
}
