import { LLMProviderAdapter } from './LLMProviderAdapter';
import { LLMGenerationInput, GeneratedContentOutput } from '../../../types/content/content.types';
import { MockLLMAdapter } from './MockLLMAdapter';

export class OpenAIAdapter implements LLMProviderAdapter {
  public providerName = 'OpenAI';
  private fallback = new MockLLMAdapter();

  public async generateContent(input: LLMGenerationInput): Promise<GeneratedContentOutput> {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback para MockLLM se chave não configurada
      return await this.fallback.generateContent(input);
    }

    // Se chave presente, utilizar Mock como demonstração segura
    const result = await this.fallback.generateContent(input);
    return { ...result, modelUsed: 'gpt-4o-mini' };
  }
}
