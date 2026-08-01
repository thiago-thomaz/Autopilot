export class EventNormalizationService {
  public static normalizePayload(raw: any) {
    return {
      eventType: (raw.type || raw.eventType || 'UNKNOWN').toUpperCase(),
      country: (raw.country || 'BR').toUpperCase(),
      language: raw.language || 'pt-BR',
      currency: (raw.currency || 'BRL').toUpperCase(),
      timestamp: raw.timestamp ? new Date(raw.timestamp) : new Date(),
    };
  }
}
