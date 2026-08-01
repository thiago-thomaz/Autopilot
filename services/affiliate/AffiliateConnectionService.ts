import { prisma } from '@/lib/prisma';
import { AffiliatePlatformService } from './AffiliatePlatformService';
import { CredentialVault } from './CredentialVault';
import { AffiliateError } from './types/affiliate.errors';
import { Logger } from '@/lib/logger';

export class AffiliateConnectionService {
  /**
   * Testa a conexão de uma conta de afiliado e persiste os resultados da auditoria.
   */
  public static async testAccountConnection(accountId: string) {
    const account = await prisma.affiliateAccount.findUnique({
      where: { id: accountId },
      include: { affiliatePlatform: true },
    });

    if (!account) {
      throw new AffiliateError('Conta de afiliado não encontrada para teste de conexão.', 'ACCOUNT_NOT_FOUND', 404);
    }

    const adapter = AffiliatePlatformService.getAdapter(account.affiliatePlatform.slug);
    const credentials = CredentialVault.getCredential(account.credentialsEncrypted);

    Logger.info('AFFILIATE_CONNECTION', 'TEST_START', `Iniciando teste de conexão para conta '${account.accountName}' (${account.affiliatePlatform.slug}).`);

    const result = await adapter.testConnection(credentials);

    // Atualizar registro no banco
    const updated = await prisma.affiliateAccount.update({
      where: { id: accountId },
      data: {
        status: result.status as any,
        lastConnectionTest: new Date(result.testedAt),
        lastConnectionStatus: result.message,
        lastError: result.success ? null : result.message,
      },
      include: { affiliatePlatform: true },
    });

    Logger.info('AFFILIATE_CONNECTION', 'TEST_COMPLETE', `Teste finalizado para '${account.accountName}' com status: ${result.status}.`);

    return {
      accountId: updated.id,
      accountName: updated.accountName,
      platformSlug: account.affiliatePlatform.slug,
      testResult: result,
    };
  }
}
