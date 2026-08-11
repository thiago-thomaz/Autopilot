import { prisma } from '../../lib/prisma';
import { RateLimitExceededError } from '../../types/publication/publication.errors';

export class RateLimitService {
  /**
   * Verifica se a conta / canal excedeu o limite máximo diário ou horário de publicação.
   */
  public static async checkRateLimit(channel: string, accountId?: string): Promise<boolean> {
    try {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const countLastHour = await prisma.publicationRecord.count({
        where: {
          channel: channel as any,
          accountId: accountId || undefined,
          createdAt: { gte: hourAgo },
        },
      });

      // Limite seguro para testes
      if (countLastHour >= 50) {
        throw new RateLimitExceededError(channel, 60);
      }
      return true;
    } catch (err: any) {
      if (err instanceof RateLimitExceededError) throw err;
      return true;
    }
  }
}
