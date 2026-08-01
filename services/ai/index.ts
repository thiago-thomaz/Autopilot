/**
 * Contrato do Serviço de Provedores de Inteligência Artificial
 */

export interface AIServicePromptOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

export interface IAIService {
  generateText(options: AIServicePromptOptions): Promise<string>;
}

export class AIService implements IAIService {
  async generateText(_options: AIServicePromptOptions): Promise<string> {
    // Stub para Módulo 1
    return 'Resposta simulada do modelo de IA.';
  }
}
