import { FXConversionResult } from '../../types/global/localization.types';
import { FXRateError } from '../../types/global/global.errors';

export class FXService {
  private rates: Map<string, number> = new Map([
    ['USD_USD', 1.0],
    ['USD_BRL', 5.25],
    ['BRL_USD', 0.19],
    ['USD_EUR', 0.92],
    ['EUR_USD', 1.087],
    ['USD_GBP', 0.78],
    ['GBP_USD', 1.28],
    ['USD_JPY', 155.0],
    ['JPY_USD', 0.00645],
    ['USD_INR', 83.50],
    ['INR_USD', 0.012]
  ]);

  /**
   * Converts monetary amount between currencies with stale indicator check
   */
  public convertCurrency(amount: number, currencyFrom: string, currencyTo: string): FXConversionResult {
    const from = currencyFrom.toUpperCase();
    const to = currencyTo.toUpperCase();

    if (from === to) {
      return {
        amountFrom: amount,
        currencyFrom: from,
        amountTo: amount,
        currencyTo: to,
        exchangeRate: 1.0,
        isStale: false,
        timestamp: new Date().toISOString()
      };
    }

    const pairKey = `${from}_${to}`;
    let rate = this.rates.get(pairKey);

    let isStale = false;

    // Cross-rate calculation via USD if direct pair missing
    if (!rate) {
      const fromToUSD = this.rates.get(`${from}_USD`);
      const usdToTarget = this.rates.get(`USD_${to}`);
      if (fromToUSD && usdToTarget) {
        rate = fromToUSD * usdToTarget;
      } else {
        // Fallback to safe default rate = 1.0 with isStale = true
        rate = 1.0;
        isStale = true;
      }
    }

    const convertedAmount = Number((amount * rate).toFixed(4));

    return {
      amountFrom: amount,
      currencyFrom: from,
      amountTo: convertedAmount,
      currencyTo: to,
      exchangeRate: Number(rate.toFixed(4)),
      isStale,
      timestamp: new Date().toISOString()
    };
  }

  public updateRate(currencyFrom: string, currencyTo: string, rate: number): void {
    if (rate <= 0) throw new FXRateError('Exchange rate must be positive');
    this.rates.set(`${currencyFrom.toUpperCase()}_${currencyTo.toUpperCase()}`, rate);
  }
}
