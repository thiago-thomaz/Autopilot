import { TranslationMemoryEntry } from '../../types/global/localization.types';

export class TranslationMemoryService {
  private memoryStore: Map<string, TranslationMemoryEntry> = new Map();

  /**
   * Generates a simple SHA-256 equivalent hash key for text segment
   */
  public generateHash(text: string, languageFrom: string, languageTo: string): string {
    const rawKey = `${languageFrom.toLowerCase()}:${languageTo.toLowerCase()}:${text.trim().toLowerCase()}`;
    let hash = 0;
    for (let i = 0; i < rawKey.length; i++) {
      const char = rawKey.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `tm_${Math.abs(hash).toString(16)}`;
  }

  public getTranslation(sourceText: string, languageFrom: string, languageTo: string): TranslationMemoryEntry | null {
    const key = this.generateHash(sourceText, languageFrom, languageTo);
    const entry = this.memoryStore.get(key);
    if (entry) {
      entry.usageCount++;
      return entry;
    }
    return null;
  }

  public storeTranslation(sourceText: string, translatedText: string, languageFrom: string, languageTo: string, domain: string = 'AFFILIATE'): void {
    const key = this.generateHash(sourceText, languageFrom, languageTo);
    this.memoryStore.set(key, {
      id: key,
      sourceHash: key,
      sourceText,
      translatedText,
      languageFrom,
      languageTo,
      domain,
      usageCount: 1
    });
  }
}
