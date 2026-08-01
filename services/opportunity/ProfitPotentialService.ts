export class ProfitPotentialService {
  /**
   * Calcula a estimativa bruta de retorno em comissão (R$) por conversão.
   */
  public static calculateProfitPotential(currentPrice: number, commissionRate = 0.05): number {
    if (!currentPrice || currentPrice <= 0) return 0;
    return Number((currentPrice * commissionRate).toFixed(2));
  }
}
