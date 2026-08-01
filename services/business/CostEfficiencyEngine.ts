export interface CostCenterPerformance {
  costCenter: string;
  totalCost: number;
  conversionsGenerated: number;
  revenueGenerated: number;
  costPerConversion: number;
  roi: number;
  efficiencyRating: 'OPTIMAL' | 'ACCEPTABLE' | 'INEFFICIENT' | 'CRITICAL';
}

export class CostEfficiencyEngine {
  public evaluateCostCenter(
    costCenter: string,
    totalCost: number,
    conversionsGenerated: number,
    revenueGenerated: number
  ): CostCenterPerformance {
    const costPerConversion = conversionsGenerated > 0 ? totalCost / conversionsGenerated : totalCost;
    const netProfit = revenueGenerated - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : netProfit > 0 ? 100 : 0;

    let efficiencyRating: 'OPTIMAL' | 'ACCEPTABLE' | 'INEFFICIENT' | 'CRITICAL' = 'ACCEPTABLE';
    if (roi >= 100) {
      efficiencyRating = 'OPTIMAL';
    } else if (roi >= 20) {
      efficiencyRating = 'ACCEPTABLE';
    } else if (roi >= 0) {
      efficiencyRating = 'INEFFICIENT';
    } else {
      efficiencyRating = 'CRITICAL';
    }

    return {
      costCenter,
      totalCost: Number(totalCost.toFixed(4)),
      conversionsGenerated,
      revenueGenerated: Number(revenueGenerated.toFixed(4)),
      costPerConversion: Number(costPerConversion.toFixed(4)),
      roi: Number(roi.toFixed(2)),
      efficiencyRating
    };
  }
}
