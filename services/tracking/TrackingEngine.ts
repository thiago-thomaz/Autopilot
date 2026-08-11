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
      // Time window of 10 minutes: Math.floor(Date.now() / (10 * 60 * 1000))
      const timeWindowMs = 10 * 60 * 1000;
      const timeWindowStr = Math.floor(Date.now() / timeWindowMs).toString();
      
      const ipHash = metadata.ip ? crypto.createHash('md5').update(metadata.ip).digest('hex') : 'unknown';
      const uaHash = metadata.userAgent ? crypto.createHash('md5').update(metadata.userAgent).digest('hex') : 'unknown';
      const idempotencyKey = `click_${publicationId}_${ipHash}_${uaHash}_${timeWindowStr}`;

      // Upsert click to avoid duplicates
      await prisma.clickEvent.upsert({
        where: { idempotencyKey },
        update: {
          // just update timestamp
          clickedAt: new Date()
        },
        create: {
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
      });

      Logger.info('TRACKING', 'CLICK_REGISTERED', `Click registered successfully`, { publicationId, productId: product.id });

      // 4. Return the final destination URL (Affiliate URL)
      // The original final URL should be stored in product.url or generated at publication time
      // The logic in url.ts should have sanitized this. 
      // We assume product.url is the final affiliate link because getSanitizedProductUrl generates it.
      return product.url;

    } catch (error: any) {
      Logger.error('TRACKING', 'REDIRECT_ERROR', `Redirect Error: ${error.message}`, { publicationId });
      throw error;
    }
  }
}
