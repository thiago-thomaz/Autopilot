import { CostCenterCategory, CashReserveStatus, AffiliatePayoutStatus } from '@prisma/client';

export interface OperatingCostsBreakdown {
  aiCosts: number;
  apiCosts: number;
  contentCosts: number;
  translationCosts: number;
  publicationCosts: number;
  messagingCosts: number;
  infrastructureCosts: number;
  toolsCosts: number;
  otherCosts: number;
  totalOperatingCosts: number;
}

export interface ExecutiveDREStatement {
  date: Date | string;
  currency: string;
  grossRevenue: number;
  refunds: number;
  reversals: number;
  netRevenue: number;
  commissionRevenue: number;
  operatingCosts: OperatingCostsBreakdown;
  netProfit: number;
  profitMargin: number; // %
  roi: number; // %
}

export interface CashFlowStatement {
  openingBalance: number;
  inflows: number;
  outflows: number;
  closingBalance: number;
  netCashFlow: number;
  currency: string;
  cashReserveStatus: CashReserveStatus;
}

export interface CashReserveConfig {
  minimumCashReserve: number;
  operationalReserve: number;
  emergencyReserve: number;
  currentBalance: number;
  currency: string;
  status: CashReserveStatus;
}

export interface AffiliatePayoutRecord {
  id?: string;
  programId: string;
  period?: string;
  expectedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  currency: string;
  payoutDate?: Date | string;
  status: AffiliatePayoutStatus;
}
