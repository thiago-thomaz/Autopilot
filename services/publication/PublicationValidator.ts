import { PublicationPayload } from '../../types/publication/publication.types';

export class PublicationValidator {
  /**
   * Valida se a carga útil da publicação atende aos requisitos mínimos de texto e formato.
   */
  public static validatePayload(payload: PublicationPayload): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.title || payload.title.trim().length === 0) errors.push('Título da publicação é obrigatório.');
    if (!payload.body || payload.body.trim().length < 10) errors.push('Corpo do texto deve ter no mínimo 10 caracteres.');
    if (!payload.trackingUrl) errors.push('URL de rastreamento (trackingUrl) é obrigatória.');

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
