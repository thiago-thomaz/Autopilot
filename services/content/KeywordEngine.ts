export class KeywordEngine {
  /**
   * Extrai palavras-chave para SEO.
   */
  public static extractKeywords(title: string, category?: string, brand?: string): string[] {
    const keywords = title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (category) keywords.push(category.toLowerCase());
    if (brand) keywords.push(brand.toLowerCase());
    return Array.from(new Set(keywords));
  }
}
