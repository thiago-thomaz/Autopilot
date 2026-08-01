import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AffiliatePlatformService } from '@/services/affiliate/AffiliatePlatformService';
import { CredentialVault } from '@/services/affiliate/CredentialVault';
import { ProductNormalizationService } from '@/services/affiliate/ProductNormalizationService';

export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-n8n-api-key');
  const configuredApiKey = process.env.N8N_API_KEY || 'n8n_secret_autopilot_key_2026';

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    return NextResponse.json({ success: false, error: 'Não autorizado: Chave de API n8n inválida ou ausente.' }, { status: 401 });
  }

  try {
    const { accountId, externalId } = await req.json();
    if (!accountId || !externalId) {
      return NextResponse.json({ success: false, error: 'Campos accountId e externalId são obrigatórios.' }, { status: 400 });
    }

    const account = await prisma.affiliateAccount.findUnique({
      where: { id: accountId },
      include: { affiliatePlatform: true },
    });

    if (!account) {
      return NextResponse.json({ success: false, error: 'Conta de afiliado não encontrada.' }, { status: 404 });
    }

    const adapter = AffiliatePlatformService.getAdapter(account.affiliatePlatform.slug);
    const credentials = CredentialVault.getCredential(account.credentialsEncrypted);

    const rawProduct = await adapter.getProduct(externalId, credentials);
    if (!rawProduct) {
      return NextResponse.json({ success: false, error: 'Produto não encontrado na plataforma.' }, { status: 404 });
    }

    const saved = await ProductNormalizationService.saveOrUpdateNormalizedProduct({
      ...rawProduct,
      affiliatePlatformId: account.affiliatePlatformId,
    });

    return NextResponse.json({ success: true, product: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 400 });
  }
}
