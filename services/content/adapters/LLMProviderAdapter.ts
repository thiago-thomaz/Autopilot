import { LLMGenerationInput, GeneratedContentOutput } from '../../../types/content/content.types';

export interface LLMProviderAdapter {
  providerName: string;
  generateContent(input: LLMGenerationInput): Promise<GeneratedContentOutput>;
}
