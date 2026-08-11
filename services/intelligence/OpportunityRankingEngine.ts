import { Product, Conversion } from '@prisma/client';
import { Logger } from '../../lib/logger';
import { prisma } from '../../lib/prisma';

export interface RankedProduct extends Product {
  opportunityScore: number;
}

export class OpportunityRankingEngine {
  private static cachedWeights: Record<string, number> = {};
  private static lastWeightCalculation: Date | null = null;

  /**
   * Calcula o score matemático e ordena a lista de produtos (decrescente).
   * Agora assíncrono para permitir o recálculo via Feedback Loop.
   */
  public static async rankProducts(products: Product[]): Promise<RankedProduct[]> {
    await this.ensureWeightsCalculated();

    const ranked = products.map(product => {
      const score = this.calculateMathematicalScore(product);
      return { ...product, opportunityScore: score };
    });

    return ranked.sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  /**
   * Recalcula os pesos com base nas conversões reais dos últimos 7 dias.
   */
  public static async recalculateWeights(): Promise<void> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const conversions = await prisma.conversion.findMany({
        where: {
          convertedAt: { gte: sevenDaysAgo },
          status: 'CONFIRMED'
        },
        include: { product: true }
      });

      const categoryCounts: Record<string, number> = {};
      let totalConversions = 0;

      for (const conv of conversions) {
        const product = (conv as any).product;
        const cat = (product?.category || 'default').toLowerCase();
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        totalConversions++;
      }

      this.cachedWeights = {};
      if (totalConversions > 0) {
        for (const cat in categoryCounts) {
          // Se uma categoria representa 50% das conversões, o bônus dela é maior.
          const share = categoryCounts[cat] / totalConversions;
          // Multiplicador varia de 1.0 a 1.5 baseado na dominância nas vendas
          this.cachedWeights[cat] = 1.0 + (share * 0.5);
        }
      }

      this.lastWeightCalculation = new Date();
      Logger.info('RANKING_ENGINE', 'WEIGHTS_RECALCULATED', `Pesos das categorias atualizados baseados em ${totalConversions} conversões.`);
    } catch (err: any) {
      Logger.error('RANKING_ENGINE', 'WEIGHTS_ERROR', `Erro ao recalcular pesos: ${err.message}`);
    }
  }

  private static async ensureWeightsCalculated() {
    // Atualiza a cada 6 horas
    if (!this.lastWeightCalculation || (new Date().getTime() - this.lastWeightCalculation.getTime()) > 6 * 60 * 60 * 1000) {
      await this.recalculateWeights();
    }
  }

  private static calculateMathematicalScore(product: Product): number {
    let score = 0;

    // 1. Peso Desconto (Queda Preço 30d) - Representa 50% do score (0 a 50 pontos)
    if (product.previousPrice && product.currentPrice && product.previousPrice > product.currentPrice) {
      const discountPercentage = ((product.previousPrice - product.currentPrice) / product.previousPrice) * 100;
      score += Math.min(discountPercentage * 0.5, 50);
    }

    // 2. Peso EPC Categoria - Representa 30% do score (0 a 30 pontos)
    const categoryEpcScore = this.getCategoryBaseScore(product.category || '');
    score += categoryEpcScore * 0.3; 

    // 3. Peso A/B Template EPC - Representa 20% do score (0 a 20 pontos)
    const productRelevanceScore = product.rating ? (product.rating / 5) * 100 : 50; 
    score += productRelevanceScore * 0.2;

    return Math.round(score * 100) / 100;
  }

  private static getCategoryBaseScore(category: string): number {
    const cat = category.toLowerCase();
    let base = 50;

    if (cat.includes('eletronico') || cat.includes('celular') || cat.includes('informatica')) base = 95;
    else if (cat.includes('casa') || cat.includes('cozinha') || cat.includes('moveis')) base = 80;
    else if (cat.includes('beleza') || cat.includes('saude')) base = 85;
    else if (cat.includes('livro') || cat.includes('papelaria')) base = 60;
    
    // Aplica o multiplicador do feedback loop, limitando a max 100
    const multiplier = this.cachedWeights[cat] || 1.0;
    return Math.min(base * multiplier, 100);
  }
}
