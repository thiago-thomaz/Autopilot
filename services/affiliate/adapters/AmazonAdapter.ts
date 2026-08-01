import { BaseAffiliateAdapter } from './BaseAffiliateAdapter';
import {
  PlatformInfo,
  ConnectionTestResult,
  NormalizedProductInput,
  GeneratedAffiliateLink,
} from '../types/affiliate.types';
import { AffiliateError } from '../types/affiliate.errors';
import { Logger } from '../../../lib/logger';

export interface AmazonTokenCache {
  accessToken: string;
  expiresAt: number;
}

export class AmazonAuthService {
  private static tokenCache: Map<string, AmazonTokenCache> = new Map();

  /**
   * Obtém token de acesso autenticado da Amazon Creators API com gerenciamento de cache e expiração.
   */
  public static async getAccessToken(
    credentialId: string,
    credentialSecret: string,
    version = 'v1'
  ): Promise<string> {
    const cacheKey = `${credentialId}_${version}`;
    const cached = this.tokenCache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now + 30000) {
      return cached.accessToken;
    }

    // Se estiver em modo MOCK ou sem credenciais completas, retorna token simulado seguro
    if (process.env.AFFILIATE_MOCK_MODE === 'true' || !credentialId || !credentialSecret) {
      const mockToken = `mock_amzn_token_${Date.now()}`;
      this.tokenCache.set(cacheKey, { accessToken: mockToken, expiresAt: now + 3600000 });
      return mockToken;
    }

    try {
      // Chamada oficial de autenticação da Amazon Creators API
      const authEndpoint = 'https://api.amazon.com/auth/o2/token';
      const res = await fetch(authEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: credentialId,
          client_secret: credentialSecret,
          scope: 'amazon:creators_api',
        }),
      });

      if (!res.ok) {
        Logger.error('AMAZON_AUTH', 'TOKEN_FAILURE', `Falha na autenticação da Amazon API (Status: ${res.status}).`);
        throw new AffiliateError('Falha na autenticação com a Amazon Creators API.', 'AUTHENTICATION_FAILED', res.status);
      }

      const data = await res.json();
      const expiresInMs = (data.expires_in || 3600) * 1000;
      const accessToken = data.access_token;

      this.tokenCache.set(cacheKey, {
        accessToken,
        expiresAt: now + expiresInMs,
      });

      return accessToken;
    } catch (error: any) {
      if (error instanceof AffiliateError) throw error;
      throw new AffiliateError('Erro de conexão ao autenticar na Amazon API.', 'CONNECTION_ERROR', 500);
    }
  }
}

export class AmazonCreatorsApiClient {
  constructor(
    private credentialId: string,
    private credentialSecret: string,
    private partnerTag: string,
    private marketplace = 'amazon.com.br',
    private region = 'us-east-1'
  ) {}

  public async search(query: string): Promise<any[]> {
    if (process.env.AFFILIATE_MOCK_MODE === 'true') {
      return [
        {
          asin: 'B08N5WRWNW',
          title: `[MOCK AMAZON] ${query} - Kindle Paperwhite 16GB`,
          description: 'Novo Kindle Paperwhite com tela de 6,8" e luz quente ajustável.',
          price: 799.0,
          previousPrice: 899.0,
          url: `https://www.amazon.com.br/dp/B08N5WRWNW?tag=${this.partnerTag || 'demo-20'}`,
          imageUrl: 'https://m.media-amazon.com/images/I/61gS9lK8rQL._AC_SL1500_.jpg',
          category: 'Dispositivos Eletrônicos',
          rating: 4.8,
          reviews: 1250,
        },
        {
          asin: 'B09B2CZPSS',
          title: `[MOCK AMAZON] ${query} - Echo Dot 5ª Geração`,
          description: 'Echo Dot com som mais potente e assistente virtual Alexa.',
          price: 429.0,
          previousPrice: 479.0,
          url: `https://www.amazon.com.br/dp/B09B2CZPSS?tag=${this.partnerTag || 'demo-20'}`,
          imageUrl: 'https://m.media-amazon.com/images/I/71C3lbbeLsL._AC_SL1500_.jpg',
          category: 'Casa Inteligente',
          rating: 4.7,
          reviews: 3400,
        },
      ];
    }

    const token = await AmazonAuthService.getAccessToken(this.credentialId, this.credentialSecret);
    const endpoint = `https://creators-api.amazon.com/v1/search?keywords=${encodeURIComponent(query)}&marketplace=${this.marketplace}`;

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-amazon-partner-tag': this.partnerTag,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new AffiliateError('Erro ao buscar produtos na Amazon Creators API.', 'CONNECTION_ERROR', res.status);
    }

    const data = await res.json();
    return data.items || [];
  }

  public async getByAsin(asin: string): Promise<any | null> {
    if (process.env.AFFILIATE_MOCK_MODE === 'true') {
      return {
        asin,
        title: `[MOCK AMAZON] Produto ASIN ${asin}`,
        description: 'Descrição mock do produto selecionado na Amazon.',
        price: 299.9,
        previousPrice: 349.9,
        url: `https://www.amazon.com.br/dp/${asin}?tag=${this.partnerTag || 'demo-20'}`,
        imageUrl: 'https://m.media-amazon.com/images/I/61gS9lK8rQL._AC_SL1500_.jpg',
        category: 'Geral',
        rating: 4.6,
        reviews: 450,
      };
    }

    const token = await AmazonAuthService.getAccessToken(this.credentialId, this.credentialSecret);
    const endpoint = `https://creators-api.amazon.com/v1/items/${asin}?marketplace=${this.marketplace}`;

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-amazon-partner-tag': this.partnerTag,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new AffiliateError('Erro ao buscar ASIN na Amazon Creators API.', 'CONNECTION_ERROR', res.status);
    }

    return await res.json();
  }
}

export class AmazonAdapter extends BaseAffiliateAdapter {
  readonly platformSlug = 'amazon-brasil';
  readonly platformName = 'Amazon Brasil';

  getPlatformInfo(): PlatformInfo {
    return {
      id: 'amazon-brasil',
      name: this.platformName,
      slug: this.platformSlug,
      website: 'https://www.amazon.com.br',
      documentationUrl: 'https://associados.amazon.com.br',
      capabilities: {
        apiAvailable: true,
        linkGenerationAvailable: true,
        productDiscoveryAvailable: true,
        metricsAvailable: true,
        commissionReportingAvailable: false,
        manualLinkGenerationOnly: false,
      },
    };
  }

  validateConfiguration(credentials: Record<string, string>): boolean {
    const credId = credentials.credentialId || process.env.AMAZON_CREDENTIAL_ID;
    const credSecret = credentials.credentialSecret || process.env.AMAZON_CREDENTIAL_SECRET;
    const partnerTag = credentials.partnerTag || process.env.AMAZON_PARTNER_TAG;

    return !!(credId && credSecret && partnerTag);
  }

  async testConnection(credentials: Record<string, string>): Promise<ConnectionTestResult> {
    const testedAt = new Date().toISOString();
    const credId = credentials.credentialId || process.env.AMAZON_CREDENTIAL_ID || '';
    const credSecret = credentials.credentialSecret || process.env.AMAZON_CREDENTIAL_SECRET || '';

    if (!this.validateConfiguration(credentials) && !this.isMockMode()) {
      return {
        success: false,
        status: 'PENDING_CONFIGURATION',
        message: 'Requer Amazon Credential ID, Secret e Partner Tag (Associates Tag).',
        testedAt,
      };
    }

    try {
      await AmazonAuthService.getAccessToken(credId, credSecret);
      return {
        success: true,
        status: 'CONNECTED',
        message: 'Conexão com a Amazon Creators API (Brasil) estabelecida com sucesso.',
        testedAt,
        details: {
          marketplace: credentials.marketplace || process.env.AMAZON_MARKETPLACE || 'amazon.com.br',
          mockMode: this.isMockMode(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        status: 'CONNECTION_ERROR',
        message: error.message || 'Falha ao conectar com a Amazon API.',
        testedAt,
      };
    }
  }

  async searchProducts(query: string, credentials: Record<string, string>): Promise<NormalizedProductInput[]> {
    const credId = credentials.credentialId || process.env.AMAZON_CREDENTIAL_ID || '';
    const credSecret = credentials.credentialSecret || process.env.AMAZON_CREDENTIAL_SECRET || '';
    const partnerTag = credentials.partnerTag || process.env.AMAZON_PARTNER_TAG || 'demo-20';

    const client = new AmazonCreatorsApiClient(credId, credSecret, partnerTag);
    const items = await client.search(query);

    return items.map((item) => ({
      externalId: item.asin,
      affiliatePlatformId: this.platformSlug,
      title: item.title,
      description: item.description,
      url: item.url,
      imageUrl: item.imageUrl,
      category: item.category,
      brand: 'Amazon',
      currentPrice: item.price,
      previousPrice: item.previousPrice,
      currency: 'BRL',
      rating: item.rating,
      reviewCount: item.reviews,
      availability: true,
      commissionRate: 0.08,
      estimatedCommission: item.price * 0.08,
    }));
  }

  async getProduct(externalId: string, credentials: Record<string, string>): Promise<NormalizedProductInput | null> {
    const credId = credentials.credentialId || process.env.AMAZON_CREDENTIAL_ID || '';
    const credSecret = credentials.credentialSecret || process.env.AMAZON_CREDENTIAL_SECRET || '';
    const partnerTag = credentials.partnerTag || process.env.AMAZON_PARTNER_TAG || 'demo-20';

    const client = new AmazonCreatorsApiClient(credId, credSecret, partnerTag);
    const item = await client.getByAsin(externalId);
    if (!item) return null;

    return {
      externalId: item.asin,
      affiliatePlatformId: this.platformSlug,
      title: item.title,
      description: item.description,
      url: item.url,
      imageUrl: item.imageUrl,
      category: item.category,
      brand: 'Amazon',
      currentPrice: item.price,
      previousPrice: item.previousPrice,
      currency: 'BRL',
      rating: item.rating,
      reviewCount: item.reviews,
      availability: true,
      commissionRate: 0.08,
      estimatedCommission: item.price * 0.08,
    };
  }

  async generateAffiliateLink(rawUrl: string, credentials: Record<string, string>): Promise<GeneratedAffiliateLink> {
    this.validateUrl(rawUrl, ['amazon.com.br', 'amazon.com', 'amzn.to']);
    const partnerTag = credentials.partnerTag || process.env.AMAZON_PARTNER_TAG || 'demo-20';

    const urlObj = new URL(rawUrl);
    urlObj.searchParams.set('tag', partnerTag);

    return {
      rawUrl,
      affiliateUrl: urlObj.toString(),
      manualActionRequired: false,
    };
  }
}
