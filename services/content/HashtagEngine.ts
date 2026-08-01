export class HashtagEngine {
  /**
   * Gera hashtags relevantes e aviso de transparência.
   */
  public static generateHashtags(category?: string): string[] {
    const base = ['#afiliado', '#ofertas', '#compras', '#desconto'];
    if (category) {
      base.push(`#${category.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
    }
    return base;
  }
}
