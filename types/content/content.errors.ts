export class ContentEngineError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code = 'CONTENT_ENGINE_ERROR', statusCode = 400, details?: any) {
    super(message);
    this.name = 'ContentEngineError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
