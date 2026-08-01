import crypto from 'crypto';
import { AffiliateError } from './types/affiliate.errors';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Obter ou derivar a chave mestre da abóboda de credenciais (32 bytes / 256 bits).
 */
function getMasterKey(): Buffer {
  const secret = process.env.JWT_SECRET || process.env.VAULT_SECRET || 'affiliate_autopilot_default_vault_secret_32bytes!';
  return crypto.createHash('sha256').update(secret).digest();
}

export class CredentialVault {
  /**
   * Criptografa o objeto de credenciais e retorna uma string segura no formato iv:tag:ciphertext.
   */
  public static setCredential(accountId: string, secretData: Record<string, string>): string {
    try {
      const text = JSON.stringify({ accountId, secrets: secretData, updatedAt: new Date().toISOString() });
      const masterKey = getMasterKey();
      const iv = crypto.randomBytes(IV_LENGTH);

      const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (error: any) {
      throw new AffiliateError('Erro ao armazenar credencial no Vault.', 'VAULT_ERROR', 500, { originalError: error.message });
    }
  }

  /**
   * Descriptografa e recupera o objeto de credenciais do Vault.
   */
  public static getCredential(encryptedString: string): Record<string, string> {
    if (!encryptedString) {
      return {};
    }

    try {
      const parts = encryptedString.split(':');
      if (parts.length !== 3) {
        throw new Error('Formato de string criptografada inválido');
      }

      const [ivHex, tagHex, encryptedHex] = parts;
      const masterKey = getMasterKey();
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(tagHex, 'hex');

      const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      const parsed = JSON.parse(decrypted);
      return parsed.secrets || {};
    } catch (error: any) {
      throw new AffiliateError('Falha ao descriptografar credencial no Vault.', 'VAULT_ERROR', 500, { originalError: error.message });
    }
  }

  /**
   * Checa se existe uma credencial configurada sem revelar seus dados.
   */
  public static hasCredential(encryptedString?: string | null): boolean {
    if (!encryptedString) return false;
    try {
      const secrets = this.getCredential(encryptedString);
      return Object.keys(secrets).length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Retorna um resumo seguro das chaves configuradas sem exibir seus valores.
   */
  public static getCredentialSummary(encryptedString?: string | null): Record<string, boolean> {
    if (!encryptedString) return {};
    try {
      const secrets = this.getCredential(encryptedString);
      const summary: Record<string, boolean> = {};
      Object.keys(secrets).forEach((key) => {
        summary[key] = !!secrets[key];
      });
      return summary;
    } catch {
      return {};
    }
  }
}
