export class PlatformPolicyEngine {
  /**
   * Aplica limites de caracteres e regras específicas por plataforma.
   */
  public static truncateForPlatform(text: string, channel: string): string {
    const limits: Record<string, number> = {
      X: 280,
      INSTAGRAM: 2200,
      TIKTOK: 2200,
      TELEGRAM: 4096,
      WHATSAPP: 1000,
    };

    const maxLen = limits[channel] || 2000;
    if (text.length > maxLen) {
      return text.substring(0, maxLen - 4) + '...';
    }
    return text;
  }
}
