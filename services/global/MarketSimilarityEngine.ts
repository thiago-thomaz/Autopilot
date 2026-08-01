export class MarketSimilarityEngine {
  public calculateMarketSimilarity(originCountry: string, targetCountry: string): number {
    const o = originCountry.toUpperCase();
    const t = targetCountry.toUpperCase();

    if (o === t) return 1.0;
    if ((o === 'US' && t === 'UK') || (o === 'UK' && t === 'US')) return 0.85;
    if ((o === 'US' && t === 'CA') || (o === 'CA' && t === 'US')) return 0.90;
    if ((o === 'ES' && t === 'MX') || (o === 'MX' && t === 'ES')) return 0.80;
    if ((o === 'PT' && t === 'BR') || (o === 'BR' && t === 'PT')) return 0.75;
    if ((o === 'DE' && t === 'AT') || (o === 'AT' && t === 'DE')) return 0.92;

    return 0.50; // Default cross-culture similarity baseline
  }
}
