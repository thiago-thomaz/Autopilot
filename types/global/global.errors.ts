/**
 * Custom error definitions for Module 10 - Global Market Expansion & Localization Engine
 */

export class GlobalMarketError extends Error {
  constructor(message: string, public code: string = 'GLOBAL_MARKET_ERROR', public statusCode: number = 500) {
    super(message);
    this.name = 'GlobalMarketError';
  }
}

export class LocalizationError extends GlobalMarketError {
  constructor(message: string, public locale?: string) {
    super(message, 'LOCALIZATION_ERROR', 400);
    this.name = 'LocalizationError';
  }
}

export class FXRateError extends GlobalMarketError {
  constructor(message: string, public currencyFrom?: string, public currencyTo?: string) {
    super(message, 'FX_RATE_ERROR', 503);
    this.name = 'FXRateError';
  }
}

export class MarketPolicyViolationError extends GlobalMarketError {
  constructor(message: string, public country?: string, public policyCode?: string) {
    super(message, 'MARKET_POLICY_VIOLATION', 422);
    this.name = 'MarketPolicyViolationError';
  }
}

export class UnsupportedMarketError extends GlobalMarketError {
  constructor(message: string, public countryCode?: string) {
    super(message, 'UNSUPPORTED_MARKET', 404);
    this.name = 'UnsupportedMarketError';
  }
}

export class AffiliateDisclosureMissingError extends GlobalMarketError {
  constructor(message: string, public country?: string) {
    super(message, 'AFFILIATE_DISCLOSURE_MISSING', 400);
    this.name = 'AffiliateDisclosureMissingError';
  }
}
