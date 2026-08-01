import { GeneratedContentOutput } from '../../types/content/content.types';

export class ContentQualityService {
  /**
   * Avalia a qualidade técnica e de compliance do pacote de conteúdo (0 a 100).
   *
   * Critérios:
   * - Factual Accuracy (25%)
   * - Relevance & Clarity (25%)
   * - Hook & CTA (20%)
   * - Channel Fit (15%)
   * - Compliance & Disclosure (15%)
   */
  public static calculateQualityScores(content: GeneratedContentOutput, hasUnsupportedClaims: boolean): { qualityScore: number; complianceScore: number } {
    let quality = 70;
    let compliance = 100;

    if (content.hook && content.hook.length >= 10) quality += 10;
    if (content.caption && content.caption.length >= 50) quality += 10;
    if (content.script && content.script.length >= 3) quality += 10;

    if (hasUnsupportedClaims) {
      quality -= 30;
      compliance -= 40;
    }

    if (!content.affiliateDisclosure) {
      compliance -= 30;
    }

    return {
      qualityScore: Math.max(0, Math.min(100, quality)),
      complianceScore: Math.max(0, Math.min(100, compliance)),
    };
  }
}
