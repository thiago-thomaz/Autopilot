export class AnalyticsEngineError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code = 'ANALYTICS_ENGINE_ERROR', statusCode = 400, details?: any) {
    super(message);
    this.name = 'AnalyticsEngineError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ReconciliationMismatchError extends AnalyticsEngineError {
  constructor(orderId: string, expectedAmount: number, receivedAmount: number) {
    super(
      `Divergência financeira na conciliação da ordem '${orderId}': valor esperado R$ ${expectedAmount.toFixed(2)}, recebido R$ ${receivedAmount.toFixed(2)}.`,
      'RECONCILIATION_MISMATCH',
      422,
      { orderId, expectedAmount, receivedAmount }
    );
  }
}
