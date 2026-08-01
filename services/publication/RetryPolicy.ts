export class RetryPolicy {
  /**
   * Avalia se o erro permite tentativa (retry) ou se deve ser interrompido imediatamente.
   */
  public static shouldRetry(statusCode?: number, errorMessage?: string): { canRetry: boolean; backoffMinutes: number } {
    if (!statusCode && !errorMessage) return { canRetry: true, backoffMinutes: 5 };

    // Erros de autenticação, permissão ou opt-out NUNCA devem sofrer retry
    if (statusCode === 401 || statusCode === 403 || (errorMessage && errorMessage.includes('opt-out'))) {
      return { canRetry: false, backoffMinutes: 0 };
    }

    // Erros de timeout ou 5xx sofrem retry com exponential backoff
    return { canRetry: true, backoffMinutes: 15 };
  }
}
