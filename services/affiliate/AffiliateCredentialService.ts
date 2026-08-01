import { CredentialVault } from './CredentialVault';

export class AffiliateCredentialService {
  /**
   * Armazena e criptografa os segredos da conta de afiliado.
   */
  public static encryptCredentials(accountId: string, secretData: Record<string, string>): string {
    return CredentialVault.setCredential(accountId, secretData);
  }

  /**
   * Obtém as credenciais descriptografadas apenas para uso interno dos adapters.
   */
  public static getDecryptedCredentials(encryptedString: string): Record<string, string> {
    return CredentialVault.getCredential(encryptedString);
  }

  /**
   * Retorna resumo de credenciais sem revelar nenhum valor sensível.
   */
  public static getSanitizedCredentialSummary(encryptedString?: string | null) {
    return CredentialVault.getCredentialSummary(encryptedString);
  }
}
