import { AttributionModel, SignalType, AlertSeverity } from '@prisma/client';

export interface AnalyticsOverview {
  totalClicks: number;
  validClicks: number;
  conversions: number;
  sales: number;
  grossSalesAmount: number; // For reference
  commissionRevenue: number; // REAL REVENUE
  costs: number;
  netProfit: number;
  roi: number | null; // null if costs === 0
  ctr: number;
  cvr: number;
  epc: number;
  baseCurrency: string;
}

export interface Touchpoint {
  id: string;
  timestamp: Date;
  channel: string;
  campaignId?: string;
  contentVersionId?: string;
  productId?: string;
}

export interface AttributionResult {
  conversionId: string;
  model: AttributionModel;
  touchpoints: Array<{
    touchpointId: string;
    channel: string;
    credit: number; // 0.0 to 1.0
    attributedCommission: number;
    attributedProfit: number;
  }>;
}

export interface ReconciliationReport {
  importedRecords: number;
  matchedCount: number;
  missingCount: number;
  mismatchCount: number;
  reconciliationRate: number; // 0-100%
}
