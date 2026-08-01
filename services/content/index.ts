/**
 * Contrato do Serviço de Conteúdo
 */

export interface ContentGenerationRequest {
  productId: string;
  contentType: 'SOCIAL_POST' | 'SHORT_VIDEO_SCRIPT' | 'EMAIL' | 'MESSAGE';
  targetAudience?: string;
  tone?: string;
}

export interface GeneratedContentResult {
  title: string;
  body: string;
  callToAction: string;
  disclosure: string;
  aiModel?: string;
}

export interface IContentService {
  generateContent(request: ContentGenerationRequest): Promise<GeneratedContentResult>;
}

export class ContentService implements IContentService {
  async generateContent(_request: ContentGenerationRequest): Promise<GeneratedContentResult> {
    // Stub para Módulo 1
    return {
      title: 'Título de Exemplo de Conteúdo',
      body: 'Corpo do conteúdo gerado para divulgação do produto.',
      callToAction: 'Garanta o seu com desconto exclusivo!',
      disclosure: '#ad #afiliado',
      aiModel: 'stub-model-v1',
    };
  }
}
