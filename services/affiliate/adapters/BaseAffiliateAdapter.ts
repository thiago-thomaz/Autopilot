import { AffiliatePlatformAdapter } from '../AffiliatePlatformAdapter';
import {
  PlatformInfo,
  ConnectionTestResult,
  NormalizedProductInput,
  GeneratedAffiliateLink,
  RateLimitConfig,
} from '../types/affiliate.types';
import { AffiliateError } from '../types/affiliate.errors';
import { z } from 'zod';

export abstract class BaseAffiliateAdapter implements AffiliatePlatformAdapter {
  abstract readonly platformSlug: string;
  abstract readonly platformName: string;

  protected rateLimitConfig: RateLimitConfig = {
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000,
    cooldownMs: 1000,
    timeoutMs: 10000,
  };

  protected requestTimes: number[] = [];

  /**
   * Indica se o modo MOCK está ativo no sistema (.env AFFILIATE_MOCK_MODE=true)
   */
  protected isMockMode(): boolean {
    return process.env.AFFILIATE_MOCK_MODE === 'true';
  }

  /**
   * Proteção contra SSRF: Validação rigorosa de URL e whitelist de domínios.
   */
  protected validateUrl(url: string, allowedDomains: string[]): boolean {
    const parsed = z.string().url().safeParse(url);
    if (!parsed.success) {
      throw new AffiliateError('URL inválida fornecida para o adapter.', 'UNAUTHORIZED_DOMAIN', 400, { url });
    }

    try {
      const hostname = new URL(url).hostname;
      const isAllowed = allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
      if (!isAllowed) {
        throw new AffiliateError(`Domínio '${hostname}' não permitido por regra de segurança SSRF.`, 'UNAUTHORIZED_DOMAIN', 403, { hostname });
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica se o adapter atingiu o limite de taxa de requisições.
   */
  protected checkRateLimit(): void {
    const now = Date.now();
    this.requestTimes = this.requestTimes.filter((t) => now - t < 60000);

    if (this.requestTimes.length >= this.rateLimitConfig.maxRequestsPerMinute) {
      throw new AffiliateError(
        `Limite de requisições por minuto excedido para ${this.platformName}. Tente novamente em breve.`,
        'RATE_LIMITED',
        429,
        { limit: this.rateLimitConfig.maxRequestsPerMinute }
      );
    }
    this.requestTimes.push(now);
  }

  /**
   * Executa uma requisição HTTP controlada com suporte a timeout e cancelamento.
   */
  protected async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    this.checkRateLimit();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.rateLimitConfig.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new AffiliateError(`Requisição para ${this.platformName} excedeu o tempo limite de ${this.rateLimitConfig.timeoutMs}ms.`, 'TIMEOUT', 504);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  abstract getPlatformInfo(): PlatformInfo;
  abstract validateConfiguration(credentials: Record<string, string>): boolean;
  abstract testConnection(credentials: Record<string, string>): Promise<ConnectionTestResult>;
  abstract searchProducts(query: string, credentials: Record<string, string>): Promise<NormalizedProductInput[]>;
  abstract getProduct(externalId: string, credentials: Record<string, string>): Promise<NormalizedProductInput | null>;
  abstract generateAffiliateLink(rawUrl: string, credentials: Record<string, string>): Promise<GeneratedAffiliateLink>;

  async getMetrics(_startDate: string, _endDate: string, _credentials: Record<string, string>): Promise<Record<string, unknown>> {
    throw new AffiliateError(`Métricas não implementadas para a plataforma ${this.platformName}.`, 'NOT_IMPLEMENTED', 501);
  }

  async getCommissions(_startDate: string, _endDate: string, _credentials: Record<string, string>): Promise<Record<string, unknown>> {
    throw new AffiliateError(`Relatórios de comissão não disponíveis para a plataforma ${this.platformName}.`, 'NOT_IMPLEMENTED', 501);
  }
}
