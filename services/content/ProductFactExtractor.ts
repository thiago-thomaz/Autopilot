import { VerifiedFact } from '../../types/content/content.types';

export class ProductFactExtractor {
  /**
   * Extrai e classifica todas as informações do produto com rigor anti-alucinação.
   * Categorias:
   * - VERIFIED_FACT: Preço oficial, ID externo, título original, URL original.
   * - SOURCE_DERIVED: Percentual de desconto calculado, economia em reais.
   * - INFERENCE: Categoria de produto, público provável.
   * - UNKNOWN: Avaliações ou depoimentos ausentes.
   */
  public static extractFacts(product: {
    externalId: string;
    title: string;
    description?: string | null;
    url: string;
    currentPrice: number | any;
    previousPrice?: number | null;
    rating?: number | null;
    reviewCount?: number | null;
    brand?: string | null;
    category?: string | null;
  }): VerifiedFact[] {
    const facts: VerifiedFact[] = [
      { type: 'VERIFIED_FACT', key: 'title', value: product.title, source: 'Product' },
      { type: 'VERIFIED_FACT', key: 'externalId', value: product.externalId, source: 'Product' },
      { type: 'VERIFIED_FACT', key: 'currentPrice', value: product.currentPrice, source: 'Product' },
      { type: 'VERIFIED_FACT', key: 'url', value: product.url, source: 'Product' },
    ];

    if (product.brand) {
      facts.push({ type: 'VERIFIED_FACT', key: 'brand', value: product.brand, source: 'Product' });
    }

    if (product.previousPrice && product.previousPrice > product.currentPrice) {
      facts.push({ type: 'VERIFIED_FACT', key: 'previousPrice', value: product.previousPrice, source: 'Product' });
      const savings = product.previousPrice - product.currentPrice;
      const discountPercent = (savings / product.previousPrice) * 100;
      facts.push({ type: 'SOURCE_DERIVED', key: 'savingsAmount', value: savings.toFixed(2), source: 'Calculated' });
      facts.push({ type: 'SOURCE_DERIVED', key: 'discountPercent', value: discountPercent.toFixed(1), source: 'Calculated' });
    }

    if (product.rating !== undefined && product.rating !== null && product.rating > 0) {
      facts.push({ type: 'VERIFIED_FACT', key: 'rating', value: product.rating, source: 'Product' });
      facts.push({ type: 'VERIFIED_FACT', key: 'reviewCount', value: product.reviewCount || 0, source: 'Product' });
    } else {
      facts.push({ type: 'UNKNOWN', key: 'userReviews', value: 'Sem avaliações suficientes', source: 'Product' });
    }

    if (product.category) {
      facts.push({ type: 'INFERENCE', key: 'category', value: product.category, source: 'Taxonomy' });
    }

    return facts;
  }
}
