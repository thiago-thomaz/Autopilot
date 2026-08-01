import { describe, it, expect, vi } from 'vitest';
import { WhatsAppService } from '../../services/publication/WhatsAppService';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    whatsAppSuppressionList: {
      findUnique: vi.fn().mockImplementation(({ where }) => {
        if (where.phone === '+5511999999999') return Promise.resolve({ phone: where.phone, reason: 'OPT_OUT' });
        return Promise.resolve(null);
      }),
      upsert: vi.fn().mockResolvedValue({ id: 'supp_123' }),
    },
    whatsAppOptIn: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({ id: 'opt_123' }),
    },
    $transaction: vi.fn().mockImplementation(async (arr) => Promise.all(arr)),
  },
}));

describe('WhatsAppService (Opt-In / Opt-Out / Suppression List)', () => {
  it('deve permitir envio para número com consentimento ativo', async () => {
    const canSend = await WhatsAppService.canSendToPhone('+5511988888888');
    expect(canSend).toBe(true);
  });

  it('deve lançar ConsentViolationError para número na lista de supressão', async () => {
    await expect(WhatsAppService.canSendToPhone('+5511999999999')).rejects.toThrow('violação de consentimento');
  });

  it('deve reconhecer palavras chaves de opt-out (STOP, SAIR, CANCELAR)', async () => {
    const res1 = await WhatsAppService.processIncomingKeyword('+5511977777777', 'STOP');
    expect(res1.optedOut).toBe(true);

    const res2 = await WhatsAppService.processIncomingKeyword('+5511977777777', 'SAIR');
    expect(res2.optedOut).toBe(true);

    const res3 = await WhatsAppService.processIncomingKeyword('+5511977777777', 'Quero saber mais');
    expect(res3.optedOut).toBe(false);
  });
});
