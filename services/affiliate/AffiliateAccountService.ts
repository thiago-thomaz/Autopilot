import { prisma } from '@/lib/prisma';
import { CredentialVault } from './CredentialVault';
import { AffiliateError } from './types/affiliate.errors';
import { AffiliatePlatformService } from './AffiliatePlatformService';

export interface CreateAffiliateAccountInput {
  userId?: string;
  affiliatePlatformId: string;
  accountName: string;
  externalAccountId?: string;
  environment?: 'DEVELOPMENT' | 'PRODUCTION';
  credentials: Record<string, string>;
}

export class AffiliateAccountService {
  /**
   * Sanitiza o retorno da conta para NUNCA expor credenciais completas.
   */
  private static sanitizeAccount(account: any) {
    const { credentialsEncrypted, ...safeAccount } = account;
    return {
      ...safeAccount,
      credentialsConfigured: CredentialVault.hasCredential(credentialsEncrypted),
      credentialsSummary: CredentialVault.getCredentialSummary(credentialsEncrypted),
    };
  }

  public static async listAccounts() {
    try {
      const accounts = await prisma.affiliateAccount.findMany({
        include: { affiliatePlatform: true },
        orderBy: { createdAt: 'desc' },
      });
      return accounts.map((acc) => this.sanitizeAccount(acc));
    } catch {
      return [];
    }
  }

  public static async getAccountById(id: string) {
    try {
      const account = await prisma.affiliateAccount.findUnique({
        where: { id },
        include: { affiliatePlatform: true },
      });
      if (!account) {
        throw new AffiliateError('Conta de afiliado não encontrada.', 'ACCOUNT_NOT_FOUND', 404);
      }
      return this.sanitizeAccount(account);
    } catch (error: any) {
      if (error instanceof AffiliateError) throw error;
      throw new AffiliateError('Conta de afiliado não encontrada.', 'ACCOUNT_NOT_FOUND', 404);
    }
  }

  public static async createAccount(input: CreateAffiliateAccountInput) {
    const platform = await AffiliatePlatformService.getPlatformByIdOrSlug(input.affiliatePlatformId);
    const userId = input.userId || 'default_system_user';

    const credentialsEncrypted = CredentialVault.setCredential(
      `${platform.slug}_${Date.now()}`,
      input.credentials || {}
    );

    try {
      // Garantir que exista um usuário padrão se necessário
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: 'Administrador Afiliados',
            email: 'admin@affiliateautopilot.local',
            passwordHash: 'hashed_admin_pass',
          },
        });
      }

      // Buscar id real da plataforma
      let dbPlatform = await prisma.affiliatePlatform.findFirst({
        where: { OR: [{ id: input.affiliatePlatformId }, { slug: platform.slug }] },
      });

      if (!dbPlatform) {
        dbPlatform = await prisma.affiliatePlatform.create({
          data: {
            name: platform.name,
            slug: platform.slug,
            website: platform.website,
            documentationUrl: platform.documentationUrl,
            apiAvailable: 'capabilities' in platform ? platform.capabilities.apiAvailable : platform.apiAvailable,
            linkGenerationAvailable: 'capabilities' in platform ? platform.capabilities.linkGenerationAvailable : platform.linkGenerationAvailable,
            productDiscoveryAvailable: 'capabilities' in platform ? platform.capabilities.productDiscoveryAvailable : platform.productDiscoveryAvailable,
          },
        });
      }

      const account = await prisma.affiliateAccount.create({
        data: {
          userId: user.id,
          affiliatePlatformId: dbPlatform.id,
          accountName: input.accountName,
          externalAccountId: input.externalAccountId,
          environment: input.environment || 'PRODUCTION',
          status: 'CONFIGURED',
          credentialsEncrypted,
        },
        include: { affiliatePlatform: true },
      });

      return this.sanitizeAccount(account);
    } catch (error: any) {
      throw new AffiliateError(`Falha ao criar conta de afiliado: ${error.message}`, 'CONNECTION_ERROR', 500);
    }
  }

  public static async updateAccount(id: string, input: Partial<CreateAffiliateAccountInput>) {
    const existing = await prisma.affiliateAccount.findUnique({ where: { id } });
    if (!existing) {
      throw new AffiliateError('Conta de afiliado não encontrada.', 'ACCOUNT_NOT_FOUND', 404);
    }

    let credentialsEncrypted = existing.credentialsEncrypted;
    if (input.credentials && Object.keys(input.credentials).length > 0) {
      const existingSecrets = CredentialVault.getCredential(existing.credentialsEncrypted);
      const mergedSecrets = { ...existingSecrets, ...input.credentials };
      credentialsEncrypted = CredentialVault.setCredential(id, mergedSecrets);
    }

    const updated = await prisma.affiliateAccount.update({
      where: { id },
      data: {
        accountName: input.accountName || existing.accountName,
        externalAccountId: input.externalAccountId ?? existing.externalAccountId,
        environment: input.environment || existing.environment,
        credentialsEncrypted,
      },
      include: { affiliatePlatform: true },
    });

    return this.sanitizeAccount(updated);
  }

  public static async deleteAccount(id: string) {
    try {
      await prisma.affiliateAccount.delete({ where: { id } });
      return { success: true, message: 'Conta excluída com sucesso.' };
    } catch {
      throw new AffiliateError('Falha ao excluir conta de afiliado.', 'ACCOUNT_NOT_FOUND', 404);
    }
  }
}
