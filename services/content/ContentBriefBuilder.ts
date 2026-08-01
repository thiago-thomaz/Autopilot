import { VerifiedFact } from '../../types/content/content.types';
import { ContentAngleType, ContentPackageType, ChannelPlatform } from '@prisma/client';

export class ContentBriefBuilder {
  /**
   * Constrói o briefing consolidado para o LLM.
   */
  public static buildBrief(
    product: any,
    angle: ContentAngleType,
    channel: ChannelPlatform,
    contentType: ContentPackageType,
    verifiedFacts: VerifiedFact[]
  ) {
    return {
      productId: product.id,
      title: product.title,
      category: product.category,
      brand: product.brand,
      currentPrice: product.currentPrice,
      previousPrice: product.previousPrice,
      url: product.url,
      rating: product.rating,
      reviewCount: product.reviewCount,
      angle,
      channel,
      contentType,
      verifiedFacts,
    };
  }
}
