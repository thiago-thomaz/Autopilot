export class BrandSafetyService {
  /**
   * Garante a segurança da marca filtrando termos impróprios ou agressivos.
   */
  public static checkBrandSafety(text: string): { safe: boolean; flaggedTerms: string[] } {
    const profanity = ['golpe', 'fraude', 'lixo', 'farsa'];
    const textLower = text.toLowerCase();
    const flaggedTerms = profanity.filter((term) => textLower.includes(term));

    return {
      safe: flaggedTerms.length === 0,
      flaggedTerms,
    };
  }
}
