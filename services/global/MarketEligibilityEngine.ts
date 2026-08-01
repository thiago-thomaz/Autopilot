export class MarketEligibilityEngine {
  private supportedCountries: Set<string> = new Set(['US', 'BR', 'DE', 'UK', 'ES', 'FR', 'CA', 'AU', 'JP', 'IN']);

  public isEligible(country: string, isProductAvailableInCountry: boolean = true): boolean {
    const code = country.toUpperCase();
    if (!this.supportedCountries.has(code)) return false;
    if (!isProductAvailableInCountry) return false;
    return true;
  }
}
