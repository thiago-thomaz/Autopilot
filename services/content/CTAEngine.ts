export class CTAEngine {
  /**
   * Constrói chamadas para ação éticas sem escassez mentirosa.
   */
  public static generateCTA(channel: string): string {
    switch (channel) {
      case 'INSTAGRAM':
      case 'TIKTOK':
        return 'Confira o preço e disponibilidade no link da bio!';
      case 'TELEGRAM':
      case 'WHATSAPP':
        return 'Acesse a oferta oficial pelo link direto:';
      default:
        return 'Consulte mais informações no link oficial:';
    }
  }
}
