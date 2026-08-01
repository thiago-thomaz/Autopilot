import { BaseAffiliateAdapter } from './BaseAffiliateAdapter';
import {
  PlatformInfo,
  ConnectionTestResult,
  NormalizedProductInput,
  GeneratedAffiliateLink,
} from '../types/affiliate.types';
import { AffiliateError } from '../types/affiliate.errors';

export class MercadoLivreAdapter extends BaseAffiliateAdapter {
  readonly platformSlug = 'mercado-livre';
  readonly platformName = 'Mercado Livre';

  getPlatformInfo(): PlatformInfo {
    return {
      id: 'mercado-livre',
      name: this.platformName,
      slug: this.platformSlug,
      website: 'https://www.mercadolivre.com.br',
      documentationUrl: 'https://www.mercadolivre.com.br/afiliados',
      capabilities: {
        apiAvailable: false,
        linkGenerationAvailable: true, // via procedimento manual/link oficial
        productDiscoveryAvailable: false,
        metricsAvailable: false,
        commissionReportingAvailable: false,
        manualLinkGenerationOnly: true,
      },
    };
  }

  validateConfiguration(credentials: Record<string, string>): boolean {
    // Para Mercado Livre, a identificação é a Tag/ID de Afiliado ou Token de referência manual
    return !!(credentials.affiliateTag || credentials.accountId);
  }

  async testConnection(credentials: Record<string, string>): Promise<ConnectionTestResult> {
    const isValid = this.validateConfiguration(credentials);
    const testedAt = new Date().toISOString();

    if (!isValid) {
      return {
        success: false,
        status: 'PENDING_CONFIGURATION',
        message: 'A conta requer a configuração do Tag/ID de Afiliado do Mercado Livre.',
        testedAt,
      };
    }

    return {
      success: true,
      status: 'MANUAL_REQUIRED',
      message: 'Conta registrada. O Mercado Livre opera no modo MANUAL_LINK_GENERATION (Requer links gerados no portal oficial de afiliados).',
      testedAt,
      details: {
        mode: 'MANUAL_LINK_GENERATION',
        affiliateTag: credentials.affiliateTag || 'Configurado',
      },
    };
  }

  async searchProducts(_query: string, _credentials: Record<string, string>): Promise<NormalizedProductInput[]> {
    throw new AffiliateError(
      'A busca automática de produtos do Mercado Livre requer ação manual (Sem API pública autorizada para busca de afiliados).',
      'MANUAL_REQUIRED',
      400
    );
  }

  async getProduct(_externalId: string, _credentials: Record<string, string>): Promise<NormalizedProductInput | null> {
    throw new AffiliateError(
      'O detalhamento automático de produtos do Mercado Livre não possui API aberta de afiliados. Cadastre o produto manualmente.',
      'MANUAL_REQUIRED',
      400
    );
  }

  async generateAffiliateLink(rawUrl: string, credentials: Record<string, string>): Promise<GeneratedAffiliateLink> {
    this.validateUrl(rawUrl, ['mercadolivre.com.br', 'mercadolibre.com']);

    // Se estiver em MOCK_MODE, simula link de teste
    if (this.isMockMode()) {
      return {
        rawUrl,
        affiliateUrl: `${rawUrl}?p=mock_ml_afiliado_${credentials.affiliateTag || 'demo'}`,
        manualActionRequired: false,
        instructions: 'Link MOCK gerado para testes locais.',
      };
    }

    return {
      rawUrl,
      affiliateUrl: rawUrl, // Permite a colagem/substituição pelo usuário
      manualActionRequired: true,
      instructions: 'Esta operação requer geração através das ferramentas oficiais do Programa de Afiliados do Mercado Livre.',
    };
  }
}
