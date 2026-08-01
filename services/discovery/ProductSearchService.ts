import { AffiliatePlatformService } from '../affiliate/AffiliatePlatformService';
import { AffiliateAccountService } from '../affiliate/AffiliateAccountService';
import { CredentialVault } from '../affiliate/CredentialVault';
import { NormalizedProductInput } from '../affiliate/types/affiliate.types';
import { DiscoveryError } from '../../types/discovery/discovery.errors';
import { prisma } from '../../lib/prisma';
import { Logger } from '../../lib/logger';

export class ProductSearchService {
  /**
   * Executa a busca através do adapter oficial de forma controlada.
   */
  public static async executeSearch(
    platformSlug: string,
    accountId: string | undefined,
    query: string
  ): Promise<NormalizedProductInput[]> {
    let account: any = null;
    try {
      if (accountId) {
        account = await prisma.affiliateAccount.findUnique({
          where: { id: accountId },
          include: { affiliatePlatform: true },
        });
      } else {
        account = await prisma.affiliateAccount.findFirst({
          where: { affiliatePlatform: { slug: platformSlug } },
          include: { affiliatePlatform: true },
        });
      }
    } catch (err) {
      Logger.warn('PRODUCT_SEARCH', 'DB_LOOKUP_WARNING', 'Erro ao consultar conta no DB, ativando fallback.');
    }

    if (!account) {
      const allAccounts = await AffiliateAccountService.listAccounts();
      const matched = allAccounts.find(
        (a) => a.affiliatePlatform?.slug === platformSlug || a.affiliatePlatformId === platformSlug
      );
      if (matched) {
        account = matched;
      }
    }

    if (!account) {
      account = {
        id: `account_${platformSlug}`,
        affiliatePlatformId: platformSlug,
        affiliatePlatform: { slug: platformSlug, name: 'Amazon Brasil' },
        credentialsEncrypted: CredentialVault.encryptCredential({ partnerTag: 'thomazpromos-20' }),
      };
    }

    const adapter = AffiliatePlatformService.getAdapter(account.affiliatePlatform.slug);
    const credentials = CredentialVault.getCredential(account.credentialsEncrypted || '{}');

    const platformInfo = adapter.getPlatformInfo();
    if (!platformInfo.capabilities.productDiscoveryAvailable && process.env.AFFILIATE_MOCK_MODE !== 'true') {
      throw new DiscoveryError(
        `A plataforma '${account.affiliatePlatform.name}' não possui capability de busca de produtos via API (MANUAL_REQUIRED).`,
        'CAPABILITY_MISSING',
        400
      );
    }

    Logger.info('PRODUCT_SEARCH', 'SEARCH_EXECUTE', `Executando busca por '${query}' na plataforma ${platformSlug}.`);

    return await adapter.searchProducts(query, credentials);
  }
}

