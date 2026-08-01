export class ProfitEngine {
  /**
   * Calcula o Lucro Líquido (Receita de Comissão - Custos) e o ROI.
   * Se o custo for 0, o ROI é retornado como null para evitar divisão por zero.
   */
  public static calculateProfitAndROI(commissionRevenue: number, totalCost: number): { netProfit: number; roi: number | null } {
    const netProfit = Number((commissionRevenue - totalCost).toFixed(4));
    let roi: number | null = null;

    if (totalCost > 0) {
      roi = Number(((netProfit / totalCost) * 100).toFixed(2));
    }

    return { netProfit, roi };
  }
}
