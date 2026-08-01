import { CashReserveStatus } from '@prisma/client';
import { CashReserveConfig } from '../../types/business/financial.types';

export class CashReserveManager {
  private config: CashReserveConfig = {
    minimumCashReserve: 2000,
    operationalReserve: 1500,
    emergencyReserve: 500,
    currentBalance: 5000,
    currency: 'USD',
    status: 'NORMAL'
  };

  public updateBalance(newBalance: number): CashReserveConfig {
    this.config.currentBalance = newBalance;
    if (newBalance < this.config.minimumCashReserve) {
      this.config.status = 'SAFETY_LOCK';
    } else if (newBalance < this.config.minimumCashReserve * 1.3) {
      this.config.status = 'WARNING';
    } else {
      this.config.status = 'NORMAL';
    }
    return this.config;
  }

  public isSafetyLockActive(): boolean {
    return this.config.status === 'SAFETY_LOCK';
  }

  public getConfig(): CashReserveConfig {
    return this.config;
  }
}
