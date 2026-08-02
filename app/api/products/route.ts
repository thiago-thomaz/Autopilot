import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inMemoryProducts } from '@/services/discovery/ProductPersistenceService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let products: any[] = [];
    try {
      const where: any = {};
      if (platform) where.affiliatePlatformId = platform;
      if (category) where.category = { contains: category, mode: 'insensitive' };
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { externalId: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
        ];
      }

      products = await prisma.product.findMany({
        where,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { affiliatePlatform: true },
      });
    } catch (dbErr) {
      // Fallback para em memória
    }

    if (products.length === 0 && inMemoryProducts.length > 0) {
      products = inMemoryProducts.map((p) => ({
        ...p,
        url: `https://www.amazon.com.br/s?k=${encodeURIComponent(p.title)}&tag=thomazpromos-20`,
      }));
    }

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

