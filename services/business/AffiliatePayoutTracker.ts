import { AffiliatePayoutStatus } from '@prisma/client';
import { AffiliatePayoutRecord } from '../../types/business/financial.types';

export class AffiliatePayoutTracker {
  private payouts: Map<string, AffiliatePayoutRecord> = new Map();

  public registerPayout(payout: AffiliatePayoutRecord): void {
    const id = payout.id || `payout_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.payouts.set(id, { ...payout, id });
  }

  public updatePayoutStatus(id: string, status: AffiliatePayoutStatus, paidAmount?: number): AffiliatePayoutRecord {
    const p = this.payouts.get(id);
    if (!p) throw new Error(`Payout ${id} not found`);

    p.status = status;
    if (paidAmount !== undefined) p.paidAmount = paidAmount;
    if (status === 'PAID') p.payoutDate = new Date();

    return p;
  }

  public getPendingPayouts(): AffiliatePayoutRecord[] {
    return Array.from(this.payouts.values()).filter((p) => p.status === 'PENDING' || p.status === 'APPROVED');
  }

  public getTotalPaid(): number {
    return Array.from(this.payouts.values())
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + p.paidAmount, 0);
  }
}
