import { FXService } from './FXService';
import { PriceLocalizationEngine } from './PriceLocalizationEngine';
import { MeasurementLocalizationEngine } from './MeasurementLocalizationEngine';
import { AffiliateDisclosureLocalizationEngine } from './AffiliateDisclosureLocalizationEngine';
import { TranslationMemoryService } from './TranslationMemoryService';
import { GlossaryService } from './GlossaryService';
import { CulturalAdaptationEngine } from './CulturalAdaptationEngine';
import { LocalizationQAEngine } from './LocalizationQAEngine';
import { LocalizedContentPackage } from '../../types/global/localization.types';

export class LocalizationEngine {
  private fxService: FXService;
  private priceEngine: PriceLocalizationEngine;
  private unitEngine: MeasurementLocalizationEngine;
  private disclosureEngine: AffiliateDisclosureLocalizationEngine;
  private tmService: TranslationMemoryService;
  private glossaryService: GlossaryService;
  private culturalEngine: CulturalAdaptationEngine;
  private qaEngine: LocalizationQAEngine;

  constructor() {
    this.fxService = new FXService();
    this.priceEngine = new PriceLocalizationEngine(this.fxService);
    this.unitEngine = new MeasurementLocalizationEngine();
    this.disclosureEngine = new AffiliateDisclosureLocalizationEngine();
    this.tmService = new TranslationMemoryService();
    this.glossaryService = new GlossaryService();
    this.culturalEngine = new CulturalAdaptationEngine();
    this.qaEngine = new LocalizationQAEngine();
  }

  /**
   * Main pipeline localizing a content package to a target country & language
   */
  public localizeContent(
    contentPackageId: string,
    sourceTitle: string,
    sourceBody: string,
    sourcePrice: number,
    sourceCurrency: string,
    sourceLanguage: string,
    targetCountry: string,
    targetLanguage: string,
    targetCurrency: string
  ): LocalizedContentPackage {
    const locale = `${targetLanguage.toLowerCase()}-${targetCountry.toUpperCase()}`;

    // 1. Check Translation Memory
    let translatedTitle = sourceTitle;
    let translatedBody = sourceBody;

    const cachedTitle = this.tmService.getTranslation(sourceTitle, sourceLanguage, targetLanguage);
    if (cachedTitle) {
      translatedTitle = cachedTitle.translatedText;
    } else {
      // Perform translation & store in TM
      translatedTitle = `[${targetCountry}] ${sourceTitle}`;
      this.tmService.storeTranslation(sourceTitle, translatedTitle, sourceLanguage, targetLanguage);
    }

    const cachedBody = this.tmService.getTranslation(sourceBody, sourceLanguage, targetLanguage);
    if (cachedBody) {
      translatedBody = cachedBody.translatedText;
    } else {
      translatedBody = `[${targetCountry}] ${sourceBody}`;
      this.tmService.storeTranslation(sourceBody, translatedBody, sourceLanguage, targetLanguage);
    }

    // 2. Apply Glossary & Cultural Adaptation
    translatedTitle = this.glossaryService.applyGlossary(translatedTitle, sourceLanguage, targetLanguage);
    translatedBody = this.glossaryService.applyGlossary(translatedBody, sourceLanguage, targetLanguage);
    const cultural = this.culturalEngine.adaptContentToCulture(translatedBody, targetCountry);
    translatedBody = cultural.adaptedBody;

    // 3. Localize Price & FX
    const priceLoc = this.priceEngine.localizePrice(sourcePrice, sourceCurrency, targetCurrency);

    // 4. Inject Affiliate Disclosure
    const disclosure = this.disclosureEngine.getLocalizedDisclosure(targetCountry);

    const pkg: LocalizedContentPackage = {
      contentPackageId,
      country: targetCountry,
      language: targetLanguage,
      locale,
      translatedTitle,
      translatedCaption: translatedTitle,
      translatedBody,
      localizedPrice: priceLoc.localizedPrice,
      localizedCurrency: priceLoc.currency,
      exchangeRate: priceLoc.exchangeRate,
      translationMethod: 'HYBRID',
      qualityScore: 100,
      affiliateDisclosure: disclosure,
      status: 'READY_FOR_PUBLICATION',
      createdAt: new Date().toISOString()
    };

    // 5. Run QA
    const qa = this.qaEngine.evaluateLocalizationQA(pkg);
    pkg.qualityScore = qa.qualityScore;
    if (!qa.passed) {
      pkg.status = 'QA_PENDING';
    }

    return pkg;
  }
}
