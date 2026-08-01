import { ContentPotentialFactor } from '../../types/opportunity/opportunity.factors';

export class ContentPotentialService {
  /**
   * Avalia a facilidade e diversidade de tipos de conteúdo geráveis para o produto.
   * Categorias de Conteúdo: PRODUCT_DEMO, PROBLEM_SOLUTION, COMPARISON, REVIEW, TOP_LIST, TUTORIAL, DEAL_ALERT, SEASONAL, EVERGREEN.
   */
  public static analyzeContentPotential(category?: string, title?: string, discountPercent = 0): ContentPotentialFactor {
    const recommendedTypes: string[] = ['DEAL_ALERT', 'REVIEW'];
    let score = 60;

    const text = `${title || ''} ${category || ''}`.toLowerCase();

    if (text.includes('notebook') || text.includes('monitor') || text.includes('kindle') || text.includes('smart tv')) {
      recommendedTypes.push('PRODUCT_DEMO', 'COMPARISON', 'TOP_LIST', 'EVERGREEN');
      score += 25;
    } else if (text.includes('ferramenta') || text.includes('air fryer') || text.includes('casa')) {
      recommendedTypes.push('PROBLEM_SOLUTION', 'TUTORIAL', 'EVERGREEN');
      score += 20;
    }

    if (discountPercent >= 20) {
      recommendedTypes.push('SEASONAL');
      score += 15;
    }

    return {
      category: category || 'Geral',
      recommendedTypes,
      score: Math.min(100, score),
    };
  }
}
