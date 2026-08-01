import { NormalizedProductInput } from '../affiliate/types/affiliate.types';

export class ProductNormalizationService {
  /**
   * Normaliza dados brutos recebidos dos adapters para o contrato NormalizedProductInput.
   */
  public static normalize(raw: Partial<NormalizedProductInput>, platformId: string): NormalizedProductInput {
    return {
      externalId: String(raw.externalId || `ext_${Date.now()}`),
      affiliatePlatformId: platformId,
      title: (raw.title || 'Produto sem título').trim(),
      description: raw.description || '',
      url: raw.url || '',
      imageUrl: raw.imageUrl || '',
      category: raw.category || 'Geral',
      brand: raw.brand || 'Genérica',
      currentPrice: Number(raw.currentPrice) || 0,
      previousPrice: raw.previousPrice ? Number(raw.previousPrice) : undefined,
      currency: raw.currency || 'BRL',
      rating: raw.rating ? Number(raw.rating) : 0,
      reviewCount: raw.reviewCount ? Number(raw.reviewCount) : 0,
      availability: raw.availability !== undefined ? Boolean(raw.availability) : true,
      commissionRate: raw.commissionRate ? Number(raw.commissionRate) : 0.05,
      estimatedCommission: raw.estimatedCommission
        ? Number(raw.estimatedCommission)
        : (Number(raw.currentPrice) || 0) * (raw.commissionRate ? Number(raw.commissionRate) : 0.05),
    };
  }
}
