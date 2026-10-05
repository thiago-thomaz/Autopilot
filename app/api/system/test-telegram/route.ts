import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { TrackingEngine } from '../../../../services/tracking/TrackingEngine';
import { TelegramPublicationAdapter } from '../../../../services/publication/adapters/TelegramPublicationAdapter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json({ success: false, error: 'Missing ENV variables' });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const platform = searchParams.get('platform') || 'mercado-livre';

  // Se for ação de disparo de oferta de teste com link de rastreamento real
  if (action === 'deal') {
    try {
      // 1. Localiza ou cria um produto da plataforma especificada
      let product = await prisma.product.findFirst({
        where: {
          status: 'DISCOVERED',
          affiliatePlatform: { slug: platform },
        },
        include: { affiliatePlatform: true },
        orderBy: { updatedAt: 'desc' },
      });

      if (!product) {
        product = await prisma.product.findFirst({
          where: {
            title: platform.includes('amazon') ? { contains: 'Amazon' } : { contains: 'Mercado Livre' },
          },
          include: { affiliatePlatform: true },
          orderBy: { updatedAt: 'desc' },
        });
      }

      // Se ainda não tiver produto no DB, busca qualquer produto recente
      if (!product) {
        product = await prisma.product.findFirst({
          include: { affiliatePlatform: true },
          orderBy: { updatedAt: 'desc' },
        });
      }

      if (!product) {
        return NextResponse.json({ success: false, error: 'Nenhum produto encontrado no banco para disparo de teste' });
      }

      // 2. Cria um registro de publicação de teste para obter o ID oficial
      const record = await prisma.publicationRecord.create({
        data: {
          contentPackageId: (await prisma.contentPackage.findFirst({ select: { id: true } }))?.id || 'manual_test_pkg',
          productId: product.id,
          channel: 'TELEGRAM',
          platform: 'telegram',
          publicationType: 'AUTOMATIC',
          status: 'PUBLISHING',
          idempotencyKey: `test_deal_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          country: 'BR',
          language: 'pt-BR',
          currency: 'BRL',
          timezone: 'America/Sao_Paulo',
        },
      });

      const trackingUrl = TrackingEngine.generateTrackingUrl(record.id);

      // Prepara o texto atraente do produto com o link de rastreamento oficial
      const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.currentPrice);
      const oldPriceFormatted = product.previousPrice
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.previousPrice)
        : null;

      const discountText = product.previousPrice && product.previousPrice > product.currentPrice
        ? ` (-${Math.round(((product.previousPrice - product.currentPrice) / product.previousPrice) * 100)}% OFF)`
        : '';

      const caption = `🔥 *OFERTA EXCLUSIVA:* ${product.title}\n\n` +
        (oldPriceFormatted ? `❌ De: ${oldPriceFormatted}\n` : '') +
        `✅ Por: *${priceFormatted}*${discountText}\n\n` +
        `🛒 *Compre aqui com desconto seguro:*\n${trackingUrl}\n\n` +
        `⚡ *Vendido e entregue por ${product.affiliatePlatform?.name || (platform === 'mercado-livre' ? 'Mercado Livre' : 'Amazon')}*\n#afiliado #oferta`;

      // Atualiza o registro no banco com o payload oficial
      await prisma.publicationRecord.update({
        where: { id: record.id },
        data: {
          trackingUrl,
          publicationPayload: { body: caption, title: product.title, trackingUrl },
        },
      });

      // 3. Dispara diretamente via TelegramPublicationAdapter
      const adapter = new TelegramPublicationAdapter();
      const sendResult = await adapter.publish({
        title: product.title,
        body: caption,
        mediaUrls: product.imageUrl ? [product.imageUrl] : undefined,
        trackingUrl,
        affiliateDisclosure: '#afiliado',
        cta: 'Compre no link seguro',
      });

      // Atualiza status final da publicação
      await prisma.publicationRecord.update({
        where: { id: record.id },
        data: {
          status: sendResult.success ? 'PUBLISHED' : 'FAILED',
          publishedAt: sendResult.success ? new Date() : undefined,
          failedAt: sendResult.success ? undefined : new Date(),
          externalPublicationId: sendResult.externalPublicationId,
          metadata: sendResult.errorMessage ? { error: sendResult.errorMessage } : undefined,
        },
      });

      return NextResponse.json({
        success: sendResult.success,
        platform,
        product: {
          id: product.id,
          title: product.title,
          currentPrice: product.currentPrice,
          originalUrl: product.url,
        },
        publicationId: record.id,
        trackingUrl,
        telegramResult: sendResult,
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message, stack: err.stack });
    }
  }

  // Ping padrão
  try {
    const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = { chat_id: chatId, text: 'Teste interno da API (Autopilot / Coolify) ✅' };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json({ success: !!data.ok, chatId, telegramOk: !!data.ok, telegramError: data.description });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
