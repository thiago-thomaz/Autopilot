import { AffiliatePlatformService } from '../affiliate/AffiliatePlatformService';
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
    let account = null;
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

    if (!account) {
      throw new DiscoveryError(
        `Nenhuma conta cadastrada ou ativa para a plataforma '${platformSlug}'.`,
        'ACCOUNT_INACTIVE',
        404
      );
    }

    const adapter = AffiliatePlatformService.getAdapter(account.affiliatePlatform.slug);
    const credentials = CredentialVault.getCredential(account.credentialsEncrypted);

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
