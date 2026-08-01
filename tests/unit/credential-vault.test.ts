import { describe, it, expect } from 'vitest';
import { CredentialVault } from '../../services/affiliate/CredentialVault';

describe('CredentialVault (Abóboda de Credenciais Seguras)', () => {
  const accountId = 'acc_test_123';
  const secrets = {
    partnerTag: 'meutagafiliado-20',
    credentialId: 'amzn_sec_id_9999',
    credentialSecret: 'super_secret_key_abcdef',
  };

  it('deve criptografar e descriptografar credenciais corretamente com AES-256-GCM', () => {
    const encrypted = CredentialVault.setCredential(accountId, secrets);
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toContain('super_secret_key_abcdef'); // Garante que não está em texto puro

    const decrypted = CredentialVault.getCredential(encrypted);
    expect(decrypted.partnerTag).toBe('meutagafiliado-20');
    expect(decrypted.credentialId).toBe('amzn_sec_id_9999');
    expect(decrypted.credentialSecret).toBe('super_secret_key_abcdef');
  });

  it('deve gerar resumo seguro sem revelar os valores reais das chaves', () => {
    const encrypted = CredentialVault.setCredential(accountId, secrets);
    const summary = CredentialVault.getCredentialSummary(encrypted);

    expect(summary.partnerTag).toBe(true);
    expect(summary.credentialSecret).toBe(true);
    expect(summary).not.toHaveProperty('super_secret_key_abcdef');
  });

  it('deve retornar false para strings vazias ou nulas em hasCredential', () => {
    expect(CredentialVault.hasCredential(null)).toBe(false);
    expect(CredentialVault.hasCredential('')).toBe(false);
  });
});
