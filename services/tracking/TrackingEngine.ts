import { PrismaClient } from '@prisma/client';
import { Logger } from '../../lib/logger';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class TrackingEngine {
  /**
   * Generates a trackable link for a publication record.
   * This link will point to our internal /api/r redirect server.
   */
  static generateTrackingUrl(publicationId: string): string {
    const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cop.projetosunion.cloud';
    return `${baseUrl}/api/r?p=${publicationId}`;
  }

  /**
   * Registers a click and returns the final affiliate destination URL.
   * Enforces validation before redirecting.
   */
  static async registerClickAndGetRedirect(
    publicationId: string, 
    metadata: { ip?: string, userAgent?: string, source?: string }
  ): Promise<string> {
    try {
      // 1. Fetch Publication and related Product
      const publication = await prisma.publicationRecord.findUnique({
        where: { id: publicationId }
      });

      if (!publication) {
        throw new Error('Publication not found');
      }

      const product = await prisma.product.findUnique({
        where: { id: publication.productId }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // 2. Validate the offer (only block if product is explicitly rejected or archived)
      if (product.status === 'REJECTED') {
        Logger.warn('TRACKING', 'REJECTED', `Click on REJECTED product blocked`, { productId: product.id });
        throw new Error('This offer is no longer available (rejected).');
      }

      // 3. Register the Click Event (Idempotent by Hash to prevent double counting from bots in a short window)
      // Hash IP + UserAgent + publicationId + timeWindow
      // Time window of 3 seconds: Math.floor(Date.now() / 3000)
      const timeWindowMs = 3 * 1000;
      const timeWindowStr = Math.floor(Date.now() / timeWindowMs).toString();
      
      const ipHash = metadata.ip ? crypto.createHash('md5').update(metadata.ip).digest('hex') : 'unknown';
      const uaHash = metadata.userAgent ? crypto.createHash('md5').update(metadata.userAgent).digest('hex') : 'unknown';
      const idempotencyKey = `click_${publicationId}_${ipHash}_${uaHash}_${timeWindowStr}`;

      // Upsert click to avoid duplicates - executado de forma assíncrona
      const clickId = crypto.randomUUID();
      prisma.clickEvent.upsert({
        where: { idempotencyKey },
        update: {
          clickedAt: new Date()
        },
        create: {
          id: clickId,
          idempotencyKey,
          productId: product.id,
          publicationId: publication.id,
          marketplace: product.affiliatePlatformId,
          channelId: publication.channel,
          source: metadata.source || publication.channel,
          ipHash,
          userAgent: metadata.userAgent,
          clickedAt: new Date()
        }
      }).catch((err: any) => {
        Logger.error('TRACKING', 'ASYNC_TRACKING_FAILED', `Failed to register click asynchronously: ${err.message}`, { publicationId });
      });

      Logger.info('TRACKING', 'CLICK_REGISTERED', `Click registered successfully`, { publicationId, productId: product.id, clickId });

      // 4. Return the final destination URL (Affiliate URL) com blindagem anti-404 e tags de afiliado
      let finalUrl = product.url || '';
      try {
        if (finalUrl.includes('amazon')) {
          const partnerTag = process.env.AMAZON_PARTNER_TAG || process.env.NEXT_PUBLIC_AMAZON_PARTNER_TAG || 'thomazpromos-20';

          // PROTEÇÃO ANTI-404 AMAZON: Se o produto tiver ASIN antigo/quebrado ou não responder diretamente, faz busca com a tag oficial
          const deadAsins = ['B07Z49V9LL', 'B07XQ8P6S1', 'B075F38KMD', 'B07MSLFF61', 'B083321VT8', 'B075FR8X3P', 'B08N5NKBRP', 'B076VZLN7D', 'B0912K68L1', 'B07Y5VSZYV', 'B08F9N12KL', 'B07Q8G7K5D', 'B09B2CZPSS', 'B08N5WRWNW', 'B0B8K3ZSK6', 'B0C78Q1G58', 'B08X5H8D9K'];
          const isDeadAsin = deadAsins.some((d) => finalUrl.includes(d));

          if (isDeadAsin && product.title) {
            finalUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(product.title)}&tag=${partnerTag}&ascsubtag=${clickId}`;
          } else {
            const urlObj = new URL(finalUrl);
            urlObj.searchParams.set('tag', partnerTag);
            urlObj.searchParams.set('ascsubtag', clickId);
            finalUrl = urlObj.toString();
          }
        } else if (finalUrl.includes('mercadolivre') || finalUrl.includes('mlb')) {
          const mlTag = process.env.MERCADO_LIVRE_AFFILIATE_TAG || 'THOMAZ85';
          if (!finalUrl.startsWith('http')) {
            finalUrl = `https://lista.mercadolivre.com.br/${encodeURIComponent(product.title || 'ofertas')}?matt_word=${mlTag}&subid=${clickId}`;
          } else {
            const urlObj = new URL(finalUrl);
            urlObj.searchParams.set('matt_word', mlTag);
            urlObj.searchParams.set('subid', clickId);
            finalUrl = urlObj.toString();
          }
        }
      } catch (e) {
        Logger.error('TRACKING', 'URL_PARSE_ERROR', 'Failed to append affiliate tags/clickId', { finalUrl });
      }

      return finalUrl;

    } catch (error: any) {
      Logger.error('TRACKING', 'REDIRECT_ERROR', `Redirect Error: ${error.message}`, { publicationId });
      throw error;
    }
  }
}
