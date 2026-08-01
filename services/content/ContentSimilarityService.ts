export class ContentSimilarityService {
  /**
   * Avalia a sobreposição ou duplicidade de texto em relação a outros pacotes.
   */
  public static calculateSimilarity(textA: string, textB: string): number {
    if (!textA || !textB) return 0;
    const wordsA = new Set(textA.toLowerCase().split(/\s+/));
    const wordsB = new Set(textB.toLowerCase().split(/\s+/));

    const intersection = new Set([...wordsA].filter((w) => wordsB.has(w)));
    const union = new Set([...wordsA, ...wordsB]);

    if (union.size === 0) return 0;
    return Math.round((intersection.size / union.size) * 100);
  }
}
