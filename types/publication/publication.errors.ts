export class PublicationEngineError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code = 'PUBLICATION_ENGINE_ERROR', statusCode = 400, details?: any) {
    super(message);
    this.name = 'PublicationEngineError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class RateLimitExceededError extends PublicationEngineError {
  constructor(channel: string, resetTimeMinutes = 60) {
    super(
      `Limite de taxa (Rate Limit) excedido para o canal '${channel}'. Tente novamente em ${resetTimeMinutes} minutos.`,
      'RATE_LIMIT_EXCEEDED',
      429,
      { channel, resetTimeMinutes }
    );
  }
}

export class ConsentViolationError extends PublicationEngineError {
  constructor(recipient: string, reason: string) {
    super(
      `Envio bloqueado por violação de consentimento / opt-out para '${recipient}': ${reason}.`,
      'CONSENT_VIOLATION',
      403,
      { recipient, reason }
    );
  }
}
