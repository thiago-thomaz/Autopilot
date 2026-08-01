export class InsightEngine {
  /**
   * Gera resumos em linguagem natural sobre o desempenho comprovado da plataforma.
   */
  public static generateNaturalLanguageInsights(totalRevenue: number, totalCosts: number, netProfit: number, roi: number | null) {
    const insights: string[] = [];

    if (netProfit > 0) {
      insights.push(`A plataforma gerou um Lucro Líquido de R$ ${netProfit.toFixed(2)} com ROI de ${roi !== null ? roi.toFixed(1) + '%' : 'N/A'}.`);
    } else if (netProfit < 0) {
      insights.push(`Os custos (R$ ${totalCosts.toFixed(2)}) superaram as comissões recebidas (R$ ${totalRevenue.toFixed(2)}). Recomenda-se pausar campanhas deficitárias.`);
    } else {
      insights.push('A operação está em ponto de equilíbrio financeiro.');
    }

    return insights;
  }
}
