import { CashReserveStatus } from '@prisma/client';
import { CashFlowStatement } from '../../types/business/financial.types';

export class CashFlowEngine {
  public generateStatement(
    openingBalance: number,
    inflows: number,
    outflows: number,
    minimumCashReserve: number = 1000,
    currency: string = 'USD'
  ): CashFlowStatement {
    const netCashFlow = inflows - outflows;
    const closingBalance = openingBalance + netCashFlow;

    let cashReserveStatus: CashReserveStatus = 'NORMAL';
    if (closingBalance < minimumCashReserve) {
      cashReserveStatus = 'SAFETY_LOCK';
    } else if (closingBalance < minimumCashReserve * 1.25) {
      cashReserveStatus = 'WARNING';
    }

    return {
      openingBalance: Number(openingBalance.toFixed(4)),
      inflows: Number(inflows.toFixed(4)),
      outflows: Number(outflows.toFixed(4)),
      closingBalance: Number(closingBalance.toFixed(4)),
      netCashFlow: Number(netCashFlow.toFixed(4)),
      currency,
      cashReserveStatus
    };
  }
}
