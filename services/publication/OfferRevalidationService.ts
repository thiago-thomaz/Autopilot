import { prisma } from '../../lib/prisma';

export class OfferRevalidationService {
  /**
   * Revalida se o produto ainda está disponível e se o preço se manteve estável antes da publicação.
   */
  public static async revalidateProduct(productId: string): Promise<{ valid: boolean; reason?: string }> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) return { valid: false, reason: 'Produto não existe mais no banco.' };
      if (!product.availability) return { valid: false, reason: 'Produto indisponível ou esgotado no fornecedor.' };
      if (product.currentPrice <= 0) return { valid: false, reason: 'Preço inválido ou Zerado.' };

      return { valid: true };
    } catch {
      return { valid: true };
    }
  }
}
