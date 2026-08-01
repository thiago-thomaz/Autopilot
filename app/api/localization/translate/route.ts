import { NextResponse } from 'next/server';
import { TranslationMemoryService, GlossaryService } from '../../../../services/global';

const tmService = new TranslationMemoryService();
const glossaryService = new GlossaryService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, sourceLanguage = 'en', targetLanguage = 'es' } = body;

    const cached = tmService.getTranslation(text, sourceLanguage, targetLanguage);
    let translated = cached ? cached.translatedText : `[${targetLanguage.toUpperCase()}] ${text}`;

    if (!cached) {
      tmService.storeTranslation(text, translated, sourceLanguage, targetLanguage);
    }

    translated = glossaryService.applyGlossary(translated, sourceLanguage, targetLanguage);

    return NextResponse.json({ success: true, data: { original: text, translated, sourceLanguage, targetLanguage, cached: !!cached } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
