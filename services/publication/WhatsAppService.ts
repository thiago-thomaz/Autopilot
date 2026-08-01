import { prisma } from '../../lib/prisma';
import { ConsentViolationError } from '../../types/publication/publication.errors';
import { Logger } from '../../lib/logger';

export class WhatsAppService {
  /**
   * Verifica se o número de telefone possui consentimento ativo e não está na lista de supressão.
   */
  public static async canSendToPhone(phone: string): Promise<boolean> {
    try {
      const suppressed = await prisma.whatsAppSuppressionList.findUnique({
        where: { phone },
      });

      if (suppressed) {
        throw new ConsentViolationError(phone, 'Número presente na lista de supressão (Opt-Out).');
      }

      const optIn = await prisma.whatsAppOptIn.findUnique({
        where: { phone },
      });

      if (optIn && optIn.status === 'OPTED_OUT') {
        throw new ConsentViolationError(phone, 'Usuário solicitou descadastramento.');
      }

      return true;
    } catch (err: any) {
      if (err instanceof ConsentViolationError) throw err;
      return true;
    }
  }

  /**
   * Processa palavras-chave de opt-out (STOP, SAIR, CANCELAR) recebidas via mensagens.
   */
  public static async processIncomingKeyword(phone: string, text: string): Promise<{ optedOut: boolean }> {
    const cleanText = text.trim().toUpperCase();
    const optOutKeywords = ['STOP', 'SAIR', 'CANCELAR', 'PARAR', 'UNSUBSCRIBE'];

    if (optOutKeywords.includes(cleanText)) {
      await prisma.$transaction([
        prisma.whatsAppOptIn.upsert({
          where: { phone },
          update: { status: 'OPTED_OUT', optOutReason: 'KEYWORD_OPT_OUT' },
          create: { phone, status: 'OPTED_OUT', optOutReason: 'KEYWORD_OPT_OUT' },
        }),
        prisma.whatsAppSuppressionList.upsert({
          where: { phone },
          update: { reason: 'KEYWORD_OPT_OUT' },
          create: { phone, reason: 'KEYWORD_OPT_OUT' },
        }),
      ]);

      Logger.warn('WHATSAPP_SERVICE', 'OPT_OUT_PROCESSED', `Opt-Out processado para o telefone ${phone}`);
      return { optedOut: true };
    }

    return { optedOut: false };
  }
}
