import { prisma } from '../../lib/prisma';
import { ConsentViolationError } from '../../types/publication/publication.errors';
import { Logger } from '../../lib/logger';

export class EmailService {
  /**
   * Verifica se o endereço de e-mail possui consentimento válido.
   */
  public static async canSendToEmail(email: string): Promise<boolean> {
    try {
      const contact = await prisma.emailContact.findUnique({
        where: { email },
      });

      if (contact && !contact.consentGiven) {
        throw new ConsentViolationError(email, 'Contato com flag consentGiven = false (Opt-Out).');
      }

      return true;
    } catch (err: any) {
      if (err instanceof ConsentViolationError) throw err;
      return true;
    }
  }

  /**
   * Processa o descadastramento (Unsubscribe).
   */
  public static async unsubscribeEmail(email: string): Promise<void> {
    await prisma.emailContact.upsert({
      where: { email },
      update: { consentGiven: false, optedOutAt: new Date() },
      create: { email, consentGiven: false, optedOutAt: new Date() },
    });

    Logger.warn('EMAIL_SERVICE', 'UNSUBSCRIBE_PROCESSED', `Unsubscribe efetuado para o e-mail ${email}`);
  }
}
