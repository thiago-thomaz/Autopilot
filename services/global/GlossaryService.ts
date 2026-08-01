import { GlobalGlossaryEntry } from '../../types/global/localization.types';

export class GlossaryService {
  private glossaryStore: Map<string, GlobalGlossaryEntry> = new Map();

  constructor() {
    // Default protected terms
    this.addTerm('Affiliate Autopilot', 'Affiliate Autopilot', 'en', 'es');
    this.addTerm('Affiliate Autopilot', 'Affiliate Autopilot', 'en', 'de');
    this.addTerm('Kindle Paperwhite', 'Kindle Paperwhite', 'en', 'pt');
  }

  public addTerm(term: string, translatedTerm: string, languageFrom: string, languageTo: string): void {
    const key = `${languageFrom}:${languageTo}:${term.toLowerCase()}`;
    this.glossaryStore.set(key, {
      term,
      translatedTerm,
      languageFrom,
      languageTo,
      domain: 'PRODUCT'
    });
  }

  public applyGlossary(text: string, languageFrom: string, languageTo: string): string {
    let result = text;
    for (const entry of Array.from(this.glossaryStore.values())) {
      if (entry.languageFrom === languageFrom && entry.languageTo === languageTo) {
        const regex = new RegExp(`\\b${entry.term}\\b`, 'gi');
        result = result.replace(regex, entry.translatedTerm);
      }
    }
    return result;
  }
}
