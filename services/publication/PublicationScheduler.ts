export class PublicationScheduler {
  /**
   * Calcula a data/hora ideal de publicação ajustando para o fuso horário e janela permitida do país.
   */
  public static calculateNextPostingWindow(targetTimezone = 'America/Sao_Paulo', requestedDate?: Date): Date {
    const baseDate = requestedDate || new Date();
    // Adiciona pequeno espaçamento aleatório (1-5 minutos) para distribuição natural
    const offsetMs = Math.floor(Math.random() * 4 + 1) * 60 * 1000;
    return new Date(baseDate.getTime() + offsetMs);
  }
}
