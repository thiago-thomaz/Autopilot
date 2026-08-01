import { prisma } from '../../lib/prisma';
import { Logger } from '../../lib/logger';

export class ProductPriceHistoryService {
  /**
   * Grava um novo histórico de preço somente se houver alteração em relação ao último registro capturado.
   */
  public static async recordPriceHistoryIfChanged(
    productId: string,
    currentPrice: number,
    previousPrice?: number,
    currency = 'BRL',
    availability = true,
    source = 'DISCOVERY'
  ) {
    try {
      const lastEntry = await prisma.productPriceHistory.findFirst({
        where: { productId },
        orderBy: { capturedAt: 'desc' },
      });

      const hasPriceChanged = !lastEntry || lastEntry.price !== currentPrice;
      const hasAvailabilityChanged = !lastEntry || lastEntry.availability !== availability;

      if (hasPriceChanged || hasAvailabilityChanged) {
        const discountPercent =
          previousPrice && previousPrice > currentPrice
            ? ((previousPrice - currentPrice) / previousPrice) * 100
            : 0.0;

        const history = await prisma.productPriceHistory.create({
          data: {
            productId,
            price: currentPrice,
            previousPrice: previousPrice || null,
            currency,
            discountPercent,
            availability,
            source,
          },
        });

        Logger.info('PRICE_HISTORY', 'PRICE_RECORDED', `Histórico de preço registrado para produto ${productId}: R$ ${currentPrice}`);
        return history;
      }
      return null;
    } catch (err: any) {
      Logger.error('PRICE_HISTORY', 'RECORD_FAILED', `Erro ao gravar histórico de preço: ${err.message}`);
      return null;
    }
  }

  /**
   * Consulta o histórico de preços de um produto filtrado por período de dias.
   */
  public static async getPriceHistory(productId: string, days?: number) {
    let whereClause: any = { productId };

    if (days && days > 0) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      whereClause.capturedAt = { gte: startDate };
    }

    return await prisma.productPriceHistory.findMany({
      where: whereClause,
      orderBy: { capturedAt: 'asc' },
    });
  }
}
