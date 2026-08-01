export type AffiliateErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'AUTHENTICATION_FAILED'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'NOT_FOUND'
  | 'MANUAL_REQUIRED'
  | 'NOT_IMPLEMENTED'
  | 'UNAUTHORIZED_DOMAIN'
  | 'VAULT_ERROR'
  | 'PLATFORM_NOT_FOUND'
  | 'ACCOUNT_NOT_FOUND'
  | 'CONNECTION_ERROR';

export class AffiliateError extends Error {
  public readonly code: AffiliateErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: AffiliateErrorCode, statusCode = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AffiliateError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AffiliateError.prototype);
  }
}
