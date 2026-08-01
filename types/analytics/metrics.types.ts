export interface FunnelMetrics {
  impressions: number;
  clicks: number;
  validClicks: number;
  conversions: number;
  sales: number;
  commissionsApproved: number;
  ctrPercent: number;
  cvrPercent: number;
}

export interface DimensionBreakdown {
  dimension: 'country' | 'channel' | 'product' | 'campaign';
  key: string;
  clicks: number;
  conversions: number;
  commissionRevenue: number;
  costs: number;
  netProfit: number;
  roi: number | null;
}
