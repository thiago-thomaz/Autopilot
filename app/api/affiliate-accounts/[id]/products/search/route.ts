import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AffiliatePlatformService } from '@/services/affiliate/AffiliatePlatformService';
import { CredentialVault } from '@/services/affiliate/CredentialVault';
import { ProductNormalizationService } from '@/services/affiliate/ProductNormalizationService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ success: false, error: 'O termo de busca (query) é obrigatório.' }, { status: 400 });
    }

    const account = await prisma.affiliateAccount.findUnique({
      where: { id: params.id },
      include: { affiliatePlatform: true },
    });

    if (!account) {
      return NextResponse.json({ success: false, error: 'Conta de afiliado não encontrada.' }, { status: 404 });
    }

    const adapter = AffiliatePlatformService.getAdapter(account.affiliatePlatform.slug);
    const credentials = CredentialVault.getCredential(account.credentialsEncrypted);

    const rawProducts = await adapter.searchProducts(query, credentials);

    // Normalizar e salvar no banco
    const savedProducts = [];
    for (const p of rawProducts) {
      const saved = await ProductNormalizationService.saveOrUpdateNormalizedProduct({
        ...p,
        affiliatePlatformId: account.affiliatePlatformId,
      });
      savedProducts.push(saved);
    }

    return NextResponse.json({
      success: true,
      query,
      count: savedProducts.length,
      products: savedProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.statusCode || 400 });
  }
}
