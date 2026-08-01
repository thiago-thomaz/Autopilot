import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AffiliatePlatformService } from '@/services/affiliate/AffiliatePlatformService';
import { CredentialVault } from '@/services/affiliate/CredentialVault';
import { ProductNormalizationService } from '@/services/affiliate/ProductNormalizationService';

export async function POST(req: NextRequest, { params }: { params: { id: string; externalId: string } }) {
  try {
    const account = await prisma.affiliateAccount.findUnique({
      where: { id: params.id },
      include: { affiliatePlatform: true },
    });

    if (!account) {
      return NextResponse.json({ success: false, error: 'Conta de afiliado não encontrada.' }, { status: 404 });
    }

    const adapter = AffiliatePlatformService.getAdapter(account.affiliatePlatform.slug);
    const credentials = CredentialVault.getCredential(account.credentialsEncrypted);

    const rawProduct = await adapter.getProduct(params.externalId, credentials);
    if (!rawProduct) {
      return NextResponse.json({ success: false, error: 'Produto não encontrado na plataforma.' }, { status: 404 });
    }

    const saved = await ProductNormalizationService.saveOrUpdateNormalizedProduct({
      ...rawProduct,
      affiliatePlatformId: account.affiliatePlatformId,
    });

    return NextResponse.json({ success: true, product: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.statusCode || 400 });
  }
}
