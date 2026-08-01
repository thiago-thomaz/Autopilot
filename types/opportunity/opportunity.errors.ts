export class OpportunityError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code = 'OPPORTUNITY_ERROR', statusCode = 400, details?: any) {
    super(message);
    this.name = 'OpportunityError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
