import { prisma } from '../../lib/prisma';
import { MercadoLivreAdapter } from './adapters/MercadoLivreAdapter';
import { AmazonAdapter } from './adapters/AmazonAdapter';
import { AffiliatePlatformAdapter } from './AffiliatePlatformAdapter';
import { AffiliateError } from './types/affiliate.errors';

export class AffiliatePlatformService {
  private static adapters: Map<string, AffiliatePlatformAdapter> = new Map<string, AffiliatePlatformAdapter>([
    ['mercado-livre', new MercadoLivreAdapter()],
    ['amazon-brasil', new AmazonAdapter()],
  ]);

  public static getAdapter(slug: string): AffiliatePlatformAdapter {
    const adapter = this.adapters.get(slug);
    if (!adapter) {
      throw new AffiliateError(`Plataforma '${slug}' não suportada ou sem adapter implementado.`, 'PLATFORM_NOT_FOUND', 404);
    }
    return adapter;
  }

  public static async listPlatforms() {
    try {
      const platforms = await prisma.affiliatePlatform.findMany({
        orderBy: { name: 'asc' },
      });
      return platforms;
    } catch {
      // Fallback estático caso banco não esteja migrado
      return [
        new MercadoLivreAdapter().getPlatformInfo(),
        new AmazonAdapter().getPlatformInfo(),
      ];
    }
  }

  public static async getPlatformByIdOrSlug(idOrSlug: string) {
    try {
      const platform = await prisma.affiliatePlatform.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
      });
      if (platform) return platform;
    } catch {
      // Fallback
    }

    if (idOrSlug === 'mercado-livre') return new MercadoLivreAdapter().getPlatformInfo();
    if (idOrSlug === 'amazon-brasil') return new AmazonAdapter().getPlatformInfo();

    throw new AffiliateError('Plataforma de afiliados não encontrada.', 'PLATFORM_NOT_FOUND', 404);
  }
}
