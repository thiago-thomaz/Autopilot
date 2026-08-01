import { ProductQualityFactor } from '../../types/opportunity/opportunity.factors';

export class ProductQualityService {
  /**
   * Avalia a completude das informações do produto para garantir boa apresentação e conversão.
   */
  public static analyzeQuality(title?: string, description?: string, imageUrl?: string, brand?: string): ProductQualityFactor {
    const hasTitle = Boolean(title && title.trim().length >= 3);
    const hasDescription = Boolean(description && description.trim().length >= 10);
    const hasImage = Boolean(imageUrl && imageUrl.startsWith('http'));
    const hasBrand = Boolean(brand && brand.trim().length > 0 && brand !== 'Genérica');

    let score = 0;
    if (hasTitle) score += 30;
    if (hasImage) score += 40;
    if (hasDescription) score += 15;
    if (hasBrand) score += 15;

    return {
      hasTitle,
      hasDescription,
      hasImage,
      hasBrand,
      score,
    };
  }
}
