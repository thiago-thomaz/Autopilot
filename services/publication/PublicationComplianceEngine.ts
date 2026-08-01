export class PublicationComplianceEngine {
  /**
   * Garante a presença do aviso legal de transparência e conformidade com órgãos reguladores (FTC, CONAR).
   */
  public static ensureComplianceDisclosure(caption: string, country = 'BR'): string {
    const disclosure = country === 'US' ? '#ad #affiliate' : '#ad #afiliado';
    if (caption.includes('#afiliado') || caption.includes('#ad')) {
      return caption;
    }
    return `${caption}\n\n${disclosure}`;
  }
}
