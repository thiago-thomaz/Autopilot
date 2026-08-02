import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inMemoryProducts } from '@/services/discovery/ProductPersistenceService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let product: any = null;
    try {
      product = await prisma.product.findUnique({
        where: { id: params.id },
        include: {
          affiliatePlatform: true,
          priceHistory: { orderBy: { capturedAt: 'asc' } },
        },
      });
    } catch {
      // DB offline fallback
    }

    if (!product) {
      const found = inMemoryProducts.find((p) => p.id === params.id || p.externalId === params.id);
      if (found) {
        const directUrl = found.url || `https://www.amazon.com.br/s?k=%22${encodeURIComponent(found.title)}%22&tag=thomazpromos-20`;
        product = {
          ...found,
          url: directUrl,
          priceHistory: found.priceHistory || [],
          affiliatePlatform: found.affiliatePlatform || { name: 'Amazon Brasil', slug: 'amazon-brasil' },
        };
      }
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Produto não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
