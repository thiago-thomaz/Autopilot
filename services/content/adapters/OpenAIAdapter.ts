import { LLMProviderAdapter } from './LLMProviderAdapter';
import { LLMGenerationInput, GeneratedContentOutput } from '../../../types/content/content.types';
import { MockLLMAdapter } from './MockLLMAdapter';
import OpenAI from 'openai';
import { Logger } from '../../../lib/logger';

export class OpenAIAdapter implements LLMProviderAdapter {
  public providerName = 'OpenAI';
  private fallback = new MockLLMAdapter();
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  public async generateContent(input: LLMGenerationInput): Promise<GeneratedContentOutput> {
    if (!this.openai) {
      Logger.warn('OPENAI', 'API_KEY_MISSING', 'Chave OPENAI_API_KEY não configurada. Usando MockLLMAdapter.');
      const result = await this.fallback.generateContent(input);
      return { ...result, templateStyle: input.templateStyle };
    }

    try {
      const systemPrompt = this.buildSystemPrompt(input);
      const userPrompt = this.buildUserPrompt(input);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const contentStr = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(contentStr);

      return {
        hook: parsed.hook || 'Oferta Imperdível',
        title: parsed.title || input.title,
        caption: parsed.caption || '',
        cta: parsed.cta || 'Compre agora',
        hashtags: parsed.hashtags || [],
        keywords: parsed.keywords || [],
        affiliateDisclosure: 'Links geram comissão. Preços sujeitos a alteração.',
        modelUsed: 'gpt-4o-mini',
        tokensUsed: response.usage?.total_tokens,
        templateStyle: input.templateStyle
      };
    } catch (error) {
      Logger.error('OPENAI', 'GENERATION_ERROR', 'Falha ao gerar conteúdo na OpenAI, usando fallback', { error });
      const fallbackResult = await this.fallback.generateContent(input);
      return { ...fallbackResult, templateStyle: input.templateStyle };
    }
  }

  private buildSystemPrompt(input: LLMGenerationInput): string {
    let styleGuide = 'Você é um copywriter focado em conversão e marketing de afiliados.';
    
    if (input.templateStyle === 'SHORT_DIRECT') {
      styleGuide += ' Use um estilo curto, direto ao ponto e sem enrolação. Frases curtas e impacto imediato.';
    } else if (input.templateStyle === 'SCARCITY_URGENCY') {
      styleGuide += ' Use um estilo focado em escassez e urgência. Destaque que a oferta vai acabar rápido, estoque limitado ou tempo esgotando.';
    } else if (input.templateStyle === 'TECHNICAL_INFORMATIVE') {
      styleGuide += ' Use um estilo informativo. Fale de especificações, benefícios reais e detalhes técnicos do produto de forma acessível.';
    } else if (input.templateStyle === 'ECONOMY_FOCUSED') {
      styleGuide += ' Use um estilo focado em economia e inteligência financeira. Destaque o quanto a pessoa está poupando e quão ridículo o preço atual é.';
    }

    return `${styleGuide}
Você deve retornar ESTRITAMENTE um JSON válido com os seguintes campos:
- "hook": Uma frase curta (máximo 5 palavras) chamativa.
- "title": O título atraente do produto.
- "caption": A descrição para o corpo do post (2 a 4 parágrafos) usando emojis.
- "cta": Um call to action forte.
- "hashtags": Array de 5 hashtags em português (ex: ["#promocao", "#oferta"]).
- "keywords": Array de 3 palavras-chave sobre o produto.
NÃO inclua markdown, apenas o JSON puro.`;
  }

  private buildUserPrompt(input: LLMGenerationInput): string {
    const facts = input.verifiedFacts.map(f => `${f.key}: ${f.value}`).join('\n');
    return `Gere o copy para a seguinte oferta no canal ${input.channel}:
Produto: ${input.title}
Preço Atual: R$ ${input.currentPrice.toFixed(2)}
${input.previousPrice ? `Preço Antigo: R$ ${input.previousPrice.toFixed(2)}` : ''}
${input.discountPercent ? `Desconto: ${input.discountPercent}%` : ''}

Fatos Verificados:
${facts}`;
  }
}
