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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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

      // 2. Validate the offer (Is it still active? Did we pull it?)
      // Basic check: if product was rejected later, block it.
      if (product.status === 'REJECTED') {
        Logger.warn('TRACKING', 'REJECTED', `Click on REJECTED product blocked`, { productId: product.id });
        throw new Error('This offer is no longer available (rejected).');
      }

      // Check if publication is valid
      if (publication.status === 'FAILED' || publication.status === 'CANCELLED' || publication.status === 'EXPIRED') {
        Logger.warn('TRACKING', 'INVALID_STATUS', `Click on invalid publication`, { publicationId, status: publication.status });
        throw new Error('This offer is expired or invalid.');
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

      // 4. Return the final destination URL (Affiliate URL)
      // Inject subId/ascsubtag for tracking
      let finalUrl = product.url;
      try {
        const urlObj = new URL(finalUrl);
        if (finalUrl.includes('amazon')) {
            urlObj.searchParams.set('ascsubtag', clickId);
        } else if (finalUrl.includes('mercadolivre') || finalUrl.includes('mlb')) {
            urlObj.searchParams.set('subid', clickId);
        }
        finalUrl = urlObj.toString();
      } catch (e) {
        Logger.error('TRACKING', 'URL_PARSE_ERROR', 'Failed to append clickId', { finalUrl });
      }

      return finalUrl;

    } catch (error: any) {
      Logger.error('TRACKING', 'REDIRECT_ERROR', `Redirect Error: ${error.message}`, { publicationId });
      throw error;
    }
  }
}
