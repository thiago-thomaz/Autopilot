export class MetricsEngine {
  /**
   * Calcula KPIs chave de performance (CTR, CVR, EPC).
   */
  public static calculateKPIs(impressions: number, clicks: number, conversions: number, commissionRevenue: number) {
    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
    const cvr = clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : 0;
    const epc = clicks > 0 ? Number((commissionRevenue / clicks).toFixed(4)) : 0;

    return { ctr, cvr, epc };
  }
}
