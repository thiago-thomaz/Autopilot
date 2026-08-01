/**
 * Contrato do Serviço de Afiliados
 */

export interface AffiliatePlatformProvider {
  platformSlug: string;
  validateCredentials(credentials: Record<string, string>): Promise<boolean>;
  generateAffiliateLink(rawUrl: string, accountId: string): Promise<string>;
}

export interface IAffiliateService {
  listPlatforms(): Promise<Array<{ id: string; name: string; slug: string }>>;
  validatePlatformAccount(accountId: string): Promise<boolean>;
}

export class AffiliateService implements IAffiliateService {
  async listPlatforms() {
    // Stub para Módulo 1
    return [];
  }

  async validatePlatformAccount(_accountId: string) {
    return true;
  }
}
