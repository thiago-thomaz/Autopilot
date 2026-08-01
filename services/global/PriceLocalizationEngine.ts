import { FXService } from './FXService';

export class PriceLocalizationEngine {
  private fxService: FXService;

  constructor(fxService: FXService) {
    this.fxService = fxService;
  }

  public localizePrice(amount: number, currencyFrom: string, currencyTo: string): { localizedPrice: number; currency: string; exchangeRate: number } {
    const conversion = this.fxService.convertCurrency(amount, currencyFrom, currencyTo);
    const rawPrice = conversion.amountTo;
    const targetCurr = currencyTo.toUpperCase();

    let localizedPrice = rawPrice;

    // Apply psychological price rounding by market currency
    if (targetCurr === 'USD' || targetCurr === 'GBP' || targetCurr === 'CAD' || targetCurr === 'AUD') {
      const intPart = Math.floor(rawPrice);
      localizedPrice = intPart > 0 ? intPart + 0.99 : 0.99;
    } else if (targetCurr === 'EUR') {
      const intPart = Math.floor(rawPrice);
      localizedPrice = intPart > 0 ? intPart + 0.90 : 0.90;
    } else if (targetCurr === 'JPY' || targetCurr === 'KRW') {
      // Zero-decimal currencies
      localizedPrice = Math.round(rawPrice);
    } else if (targetCurr === 'BRL') {
      const intPart = Math.floor(rawPrice);
      localizedPrice = intPart > 0 ? intPart + 0.90 : 0.90;
    }

    return {
      localizedPrice: Number(localizedPrice.toFixed(2)),
      currency: targetCurr,
      exchangeRate: conversion.exchangeRate
    };
  }
}
