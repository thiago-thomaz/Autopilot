/**
 * Contrato do Serviço de Produtos e Análise de Oportunidade
 */

export interface ProductNormalized {
  externalId: string;
  platformSlug: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  category?: string;
  currentPrice: number;
  previousPrice?: number;
  currency: string;
  rating?: number;
  commissionRate?: number;
}

export interface IProductService {
  normalizeProductData(rawData: unknown): ProductNormalized;
  calculateOpportunityScore(product: ProductNormalized): number;
}

export class ProductService implements IProductService {
  normalizeProductData(rawData: unknown): ProductNormalized {
    // Stub de normalização para Módulo 1
    const data = rawData as Partial<ProductNormalized>;
    return {
      externalId: data.externalId || 'unknown',
      platformSlug: data.platformSlug || 'generic',
      title: data.title || 'Produto sem título',
      url: data.url || '',
      currentPrice: data.currentPrice || 0,
      currency: data.currency || 'BRL',
    };
  }

  calculateOpportunityScore(product: ProductNormalized): number {
    // Exemplo de cálculo de score de oportunidade (0 a 100)
    let score = 50;
    if (product.previousPrice && product.currentPrice < product.previousPrice) {
      const discountPercentage = ((product.previousPrice - product.currentPrice) / product.previousPrice) * 100;
      score += Math.min(discountPercentage, 30);
    }
    if (product.rating && product.rating >= 4.5) {
      score += 15;
    }
    if (product.commissionRate && product.commissionRate >= 0.1) {
      score += 10;
    }
    return Math.min(score, 100);
  }
}
