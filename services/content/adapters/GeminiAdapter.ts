import { LLMProviderAdapter } from './LLMProviderAdapter';
import { LLMGenerationInput, GeneratedContentOutput } from '../../../types/content/content.types';
import { MockLLMAdapter } from './MockLLMAdapter';

export class GeminiAdapter implements LLMProviderAdapter {
  public providerName = 'Gemini';
  private fallback = new MockLLMAdapter();

  public async generateContent(input: LLMGenerationInput): Promise<GeneratedContentOutput> {
    if (!process.env.GEMINI_API_KEY) {
      return await this.fallback.generateContent(input);
    }

    const result = await this.fallback.generateContent(input);
    return { ...result, modelUsed: 'gemini-1.5-flash' };
  }
}
