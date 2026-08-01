import { MarketSummary } from '../../types/global/global.types';

export class MarketDiscoveryEngine {
  private markets: MarketSummary[] = [
    { id: 'm-us', countryCode: 'US', countryName: 'United States', region: 'North America', continent: 'Americas', defaultLanguage: 'en', languages: ['en-US', 'es-US'], currency: 'USD', timezone: 'America/New_York', population: 331000000, internetPenetration: 92.0, marketStatus: 'ACTIVE' },
    { id: 'm-br', countryCode: 'BR', countryName: 'Brazil', region: 'South America', continent: 'Americas', defaultLanguage: 'pt', languages: ['pt-BR'], currency: 'BRL', timezone: 'America/Sao_Paulo', population: 214000000, internetPenetration: 81.0, marketStatus: 'ACTIVE' },
    { id: 'm-de', countryCode: 'DE', countryName: 'Germany', region: 'Western Europe', continent: 'Europe', defaultLanguage: 'de', languages: ['de-DE'], currency: 'EUR', timezone: 'Europe/Berlin', population: 83000000, internetPenetration: 93.0, marketStatus: 'TESTING' },
    { id: 'm-uk', countryCode: 'UK', countryName: 'United Kingdom', region: 'Western Europe', continent: 'Europe', defaultLanguage: 'en', languages: ['en-GB'], currency: 'GBP', timezone: 'Europe/London', population: 67000000, internetPenetration: 95.0, marketStatus: 'OPPORTUNITY' }
  ];

  public listMarkets(): MarketSummary[] {
    return this.markets;
  }

  public getMarket(countryCode: string): MarketSummary | null {
    const code = countryCode.toUpperCase();
    return this.markets.find(m => m.countryCode === code) || null;
  }
}
