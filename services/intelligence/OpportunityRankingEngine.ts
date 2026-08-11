import { Product } from '@prisma/client';
import { Logger } from '../../lib/logger';

export interface RankedProduct extends Product {
  opportunityScore: number;
}

export class OpportunityRankingEngine {
  /**
   * Calcula o score matemático e ordena a lista de produtos (decrescente).
   * Fórmula: Score = (0.5 * Queda_Preco_30d_Percentage) + (0.3 * EPC_Categoria_Normalizado) + (0.2 * EPC_Template_Normalizado)
   */
  public static rankProducts(products: Product[]): RankedProduct[] {
    const ranked = products.map(product => {
      const score = this.calculateMathematicalScore(product);
      return { ...product, opportunityScore: score };
    });

    return ranked.sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  private static calculateMathematicalScore(product: Product): number {
    let score = 0;

    // 1. Peso Desconto (Queda Preço 30d) - Representa 50% do score (0 a 50 pontos)
    if (product.previousPrice && product.currentPrice && product.previousPrice > product.currentPrice) {
      const discountPercentage = ((product.previousPrice - product.currentPrice) / product.previousPrice) * 100;
      // Normaliza desconto de 0-100 para max de 50 pontos (ex: 50% desconto = 25 pontos, 100% desconto = 50 pontos)
      score += Math.min(discountPercentage * 0.5, 50);
    }

    // 2. Peso EPC Categoria - Representa 30% do score (0 a 30 pontos)
    // Valores baseados em dados hipotéticos determinísticos para exemplificar
    const categoryEpcScore = this.getCategoryBaseScore(product.category || '');
    score += categoryEpcScore * 0.3; // categoryEpcScore vai de 0 a 100

    // 3. Peso A/B Template EPC - Representa 20% do score (0 a 20 pontos)
    // Para simplificar no nível do produto, consideramos a disponibilidade geral do produto.
    // Em um sistema real, cruzaríamos com os dados de ClickEvent do template.
    const productRelevanceScore = product.rating ? (product.rating / 5) * 100 : 50; 
    score += productRelevanceScore * 0.2;

    return Math.round(score * 100) / 100; // Arredonda para 2 casas decimais
  }

  private static getCategoryBaseScore(category: string): number {
    const cat = category.toLowerCase();
    if (cat.includes('eletronico') || cat.includes('celular') || cat.includes('informatica')) return 95; // Alto EPC
    if (cat.includes('casa') || cat.includes('cozinha') || cat.includes('moveis')) return 80;
    if (cat.includes('beleza') || cat.includes('saude')) return 85;
    if (cat.includes('livro') || cat.includes('papelaria')) return 60;
    
    return 50; // Fallback genérico
  }
}
