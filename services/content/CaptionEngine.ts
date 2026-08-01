export class CaptionEngine {
  /**
   * Constrói legendas estruturadas e transparentes.
   */
  public static buildCaption(hook: string, title: string, price: number, url: string, cta: string): string {
    return `${hook}\n\nO ${title} está saindo por R$ ${price.toFixed(2)}.\n\n${cta}\n${url}\n\n#afiliado #parceiro #ofertas`;
  }
}
