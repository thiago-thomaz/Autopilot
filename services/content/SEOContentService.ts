export class SEOContentService {
  /**
   * Otimiza títulos e meta descrições para mecanismos de busca.
   */
  public static optimizeSEO(title: string, category?: string) {
    return {
      metaTitle: `${title} | Oferta e Análise`,
      metaDescription: `Confira todos os detalhes, preço atualizado e avaliação sobre ${title}. Saiba se vale a pena comprar online.`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
  }
}
