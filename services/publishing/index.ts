/**
 * Contrato do Serviço de Publicação em Canais
 */

export interface PublishRequest {
  contentId: string;
  channelId: string;
}

export interface PublishResult {
  success: boolean;
  publicationId?: string;
  externalId?: string;
  errorMessage?: string;
}

export interface IPublishingService {
  publishContent(request: PublishRequest): Promise<PublishResult>;
}

export class PublishingService implements IPublishingService {
  async publishContent(_request: PublishRequest): Promise<PublishResult> {
    // No Módulo 1, nenhuma publicação ocorre automaticamente
    return {
      success: false,
      errorMessage: 'Publicação automática desativada no Módulo 1 (Modo MANUAL ativo).',
    };
  }
}
