import { MarketDiscoveryEngine } from './MarketDiscoveryEngine';
import { MarketEligibilityEngine } from './MarketEligibilityEngine';
import { MarketEconomicsEngine } from './MarketEconomicsEngine';
import { LocalizationEngine } from './LocalizationEngine';
import { GlobalOpportunityEngine } from './GlobalOpportunityEngine';
import { GlobalSEOEngine } from './GlobalSEOEngine';
import { ExpansionEngine } from './ExpansionEngine';
import { MarketOpportunityResult, MarketSummary } from '../../types/global/global.types';
import { LocalizedContentPackage } from '../../types/global/localization.types';

export class GlobalMarketEngine {
  private discoveryEngine: MarketDiscoveryEngine;
  private eligibilityEngine: MarketEligibilityEngine;
  private economicsEngine: MarketEconomicsEngine;
  private localizationEngine: LocalizationEngine;
  private opportunityEngine: GlobalOpportunityEngine;
  private seoEngine: GlobalSEOEngine;
  private expansionEngine: ExpansionEngine;

  constructor() {
    this.discoveryEngine = new MarketDiscoveryEngine();
    this.eligibilityEngine = new MarketEligibilityEngine();
    this.economicsEngine = new MarketEconomicsEngine();
    this.localizationEngine = new LocalizationEngine();
    this.opportunityEngine = new GlobalOpportunityEngine();
    this.seoEngine = new GlobalSEOEngine();
    this.expansionEngine = new ExpansionEngine();
  }

  public getSupportedMarkets(): MarketSummary[] {
    return this.discoveryEngine.listMarkets();
  }

  public evaluateGlobalMarketOpportunity(
    productId: string,
    category: string,
    country: string,
    language: string,
    currency: string,
    channel: string,
    expectedProfit: number,
    expectedROI: number
  ): MarketOpportunityResult {
    const isEligible = this.eligibilityEngine.isEligible(country);
    if (!isEligible) {
      return {
        productId,
        country,
        language,
        currency,
        channel,
        opportunityScore: 0,
        expectedProfit: 0,
        expectedROI: 0,
        confidence: 0,
        riskScore: 100,
        localizationCost: 0,
        netMarketValue: -100,
        recommendation: 'BLOCK',
        status: 'BLOCKED'
      };
    }

    return this.opportunityEngine.evaluateGlobalOpportunity(
      productId,
      category,
      country,
      language,
      currency,
      channel,
      expectedProfit,
      expectedROI
    );
  }

  public localizePackage(
    contentPackageId: string,
    title: string,
    body: string,
    price: number,
    sourceCurrency: string,
    sourceLanguage: string,
    targetCountry: string,
    targetLanguage: string,
    targetCurrency: string
  ): LocalizedContentPackage {
    return this.localizationEngine.localizeContent(
      contentPackageId,
      title,
      body,
      price,
      sourceCurrency,
      sourceLanguage,
      targetCountry,
      targetLanguage,
      targetCurrency
    );
  }

  public getSEOConfig(slug: string, country: string, language: string, title: string, description: string) {
    return this.seoEngine.generateSEOConfig(slug, country, language, title, description);
  }
}
