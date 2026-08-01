/**
 * Types for Localization, Trans-creation, FX, and Measurement Conversion
 */

export type TranslationMethod = 'LLM' | 'TRANSLATION_API' | 'HUMAN' | 'HYBRID';

export type LocalizationStatus = 'DRAFT' | 'QA_PENDING' | 'READY_FOR_PUBLICATION' | 'STALE' | 'BLOCKED';

export interface LocalizedContentPackage {
  id?: string;
  contentPackageId: string;
  parentContentId?: string;
  country: string;
  language: string;
  locale: string;
  translatedTitle: string;
  translatedCaption?: string;
  translatedBody: string;
  localizedPrice: number;
  localizedCurrency: string;
  exchangeRate: number;
  translationMethod: TranslationMethod;
  qualityScore: number;
  affiliateDisclosure: string;
  status: LocalizationStatus;
  createdAt: string;
}

export interface TranslationMemoryEntry {
  id?: string;
  sourceHash: string; // SHA-256 hash of source text
  sourceText: string;
  translatedText: string;
  languageFrom: string;
  languageTo: string;
  domain: string;
  usageCount: number;
}

export interface GlobalGlossaryEntry {
  id?: string;
  term: string;
  translatedTerm: string;
  languageFrom: string;
  languageTo: string;
  domain: string;
}

export interface FXConversionResult {
  amountFrom: number;
  currencyFrom: string;
  amountTo: number;
  currencyTo: string;
  exchangeRate: number;
  isStale: boolean;
  timestamp: string;
}

export interface UnitConversionResult {
  originalValue: number;
  originalUnit: string;
  convertedValue: number;
  convertedUnit: string;
}

export interface HreflangTag {
  lang: string;
  url: string;
}
