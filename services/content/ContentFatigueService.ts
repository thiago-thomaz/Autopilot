import { prisma } from '../../lib/prisma';

export class ContentFatigueService {
  /**
   * Avalia a fadiga do produto (quantidade de pacotes gerados recentemente).
   */
  public static async checkProductFatigue(productId: string): Promise<{ fatigued: boolean; count24h: number }> {
    try {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const count24h = await prisma.contentPackage.count({
        where: {
          productId,
          createdAt: { gte: dayAgo },
        },
      });

      return {
        fatigued: count24h >= 5,
        count24h,
      };
    } catch {
      return { fatigued: false, count24h: 0 };
    }
  }
}
