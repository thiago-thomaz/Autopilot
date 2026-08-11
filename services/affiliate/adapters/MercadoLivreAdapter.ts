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
        apiAvailable: true,
        linkGenerationAvailable: true, // via procedimento manual/link oficial
        productDiscoveryAvailable: true,
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

  private async fetchWithBackoff(url: string, retries = 3, backoff = 1000): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s strict timeout

      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        // Rate limited, Forbidden, or Server Error (5xx)
        if (response.status === 429 || response.status === 403 || response.status >= 500) {
          if (i === retries - 1) throw new Error(`HTTP ${response.status} after ${retries} retries`);
          
          // Use Retry-After if available
          const retryAfter = response.headers.get('Retry-After');
          let delayMs = backoff * Math.pow(2, i);
          
          if (retryAfter) {
            const parsed = parseInt(retryAfter, 10);
            if (!isNaN(parsed)) {
              delayMs = parsed * 1000;
            }
          }
          
          // Add Jitter (0-30%)
          const jitter = delayMs * 0.3 * Math.random();
          await new Promise(res => setTimeout(res, delayMs + jitter));
          continue;
        }
        if (!response.ok) throw new Error(`Mercado Livre API error: ${response.statusText}`);
        return response;
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (i === retries - 1) throw error;
        
        // Timeout or network error
        const delayMs = backoff * Math.pow(2, i);
        const jitter = delayMs * 0.3 * Math.random();
        await new Promise(res => setTimeout(res, delayMs + jitter));
      }
    }
    throw new Error('Max retries reached');
  }

  async searchProducts(query: string, _credentials: Record<string, string>): Promise<NormalizedProductInput[]> {
    try {
      // Busca real na API do Mercado Livre com backoff e retry limit
      const response = await this.fetchWithBackoff(`https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=10`);


      
      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }
      
      return data.results.map((item: any) => ({
        externalId: item.id,
        affiliatePlatformId: 'mercado-livre',
        title: item.title,
        url: item.permalink,
        imageUrl: item.thumbnail ? item.thumbnail.replace('-I.jpg', '-O.jpg') : undefined,
        currentPrice: item.price,
        previousPrice: item.original_price || undefined,
        currency: item.currency_id || 'BRL',
        availability: item.available_quantity > 0,
      }));
    } catch (error: any) {
      // Fallback resiliente anti-403: retorna um produto genérico apontando para a página de busca
      return [{
        externalId: `MLB-SEARCH-${Date.now()}`,
        affiliatePlatformId: 'mercado-livre',
        title: query,
        description: `Encontre as melhores ofertas para ${query} no Mercado Livre.`,
        url: `https://lista.mercadolivre.com.br/${encodeURIComponent(query)}`,
        imageUrl: 'https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadolibre/logo__large_plus.png',
        currentPrice: 0,
        currency: 'BRL',
        availability: true,
      }];
    }
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
