export interface ReconciliationResult {
  programId: string;
  expectedCommissions: number;
  approvedCommissions: number;
  paidCommissions: number;
  unpaidBalance: number;
  discrepancy: number;
  isMatched: boolean;
}

export class FinancialReconciliationEngine {
  public reconcilePayouts(
    programId: string,
    expectedCommissions: number,
    approvedCommissions: number,
    paidCommissions: number
  ): ReconciliationResult {
    const unpaidBalance = Math.max(0, approvedCommissions - paidCommissions);
    const discrepancy = expectedCommissions - approvedCommissions;
    const isMatched = Math.abs(discrepancy) < 0.01;

    return {
      programId,
      expectedCommissions: Number(expectedCommissions.toFixed(4)),
      approvedCommissions: Number(approvedCommissions.toFixed(4)),
      paidCommissions: Number(paidCommissions.toFixed(4)),
      unpaidBalance: Number(unpaidBalance.toFixed(4)),
      discrepancy: Number(discrepancy.toFixed(4)),
      isMatched
    };
  }
}
