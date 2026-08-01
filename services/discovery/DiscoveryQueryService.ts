import { prisma } from '../../lib/prisma';
import { DiscoveryError } from '../../types/discovery/discovery.errors';

export interface CreateDiscoveryQueryInput {
  name: string;
  platform: string;
  query: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  active?: boolean;
  priority?: number;
}

export class DiscoveryQueryService {
  public static async listQueries() {
    try {
      return await prisma.discoveryQuery.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [];
    }
  }

  public static async getQueryById(id: string) {
    const query = await prisma.discoveryQuery.findUnique({ where: { id } });
    if (!query) throw new DiscoveryError('Consulta salva não encontrada.', 'INVALID_REQUEST', 404);
    return query;
  }

  public static async createQuery(input: CreateDiscoveryQueryInput) {
    return await prisma.discoveryQuery.create({
      data: {
        name: input.name,
        platform: input.platform,
        query: input.query,
        category: input.category,
        brand: input.brand,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
        minRating: input.minRating,
        sortBy: input.sortBy || 'RELEVANCE',
        active: input.active !== undefined ? input.active : true,
        priority: input.priority || 1,
      },
    });
  }

  public static async updateQuery(id: string, input: Partial<CreateDiscoveryQueryInput>) {
    return await prisma.discoveryQuery.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }

  public static async deleteQuery(id: string) {
    return await prisma.discoveryQuery.delete({ where: { id } });
  }
}
