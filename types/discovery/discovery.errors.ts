export type DiscoveryErrorCode =
  | 'INVALID_REQUEST'
  | 'PLATFORM_UNSUPPORTED'
  | 'ACCOUNT_INACTIVE'
  | 'CAPABILITY_MISSING'
  | 'DISCOVERY_LIMIT_REACHED'
  | 'VALIDATION_FAILED'
  | 'PERSISTENCE_FAILED'
  | 'CONCURRENCY_LIMIT'
  | 'RATE_LIMITED'
  | 'TIMEOUT';

export class DiscoveryError extends Error {
  public readonly code: DiscoveryErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: DiscoveryErrorCode, statusCode = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = 'DiscoveryError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, DiscoveryError.prototype);
  }
}
