import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inMemoryProducts } from '@/services/discovery/ProductPersistenceService';

import { getSanitizedAffiliateUrl } from '@/lib/utils/affiliateUrl';

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
        product = {
          ...found,
          priceHistory: found.priceHistory || [],
          affiliatePlatform: found.affiliatePlatform || { name: 'Amazon Brasil', slug: 'amazon-brasil' },
        };
      }
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Produto não encontrado.' }, { status: 404 });
    }

    const sanitizedUrl = getSanitizedAffiliateUrl(product);
    product = {
      ...product,
      url: sanitizedUrl,
      original_url: sanitizedUrl,
      affiliate_url: sanitizedUrl,
    };

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
