import { PrismaClient } from '@prisma/client';

import { SystemConfigService } from './SystemConfigService';

const prisma = new PrismaClient();

export class AntiSpamEngine {
  /**
   * Checks if an offer is allowed to be published based on anti-spam rules.
   * Throws an error or returns false if it violates limits.
   */
  static async isAllowedToPublish(productId: string, channel: string, category?: string | null, brand?: string | null): Promise<{ allowed: boolean; reason?: string }> {
    const config = await SystemConfigService.getAntiSpamConfig();

    // 1. Check Global Rate Limits (Hour and Day)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const publicationsLastHour = await prisma.publicationRecord.count({
      where: {
        channel: channel as any,
        createdAt: { gte: oneHourAgo },
        status: { in: ['PUBLISHED', 'PUBLISHING'] }
      }
    });

    if (publicationsLastHour >= config.MAX_POSTS_PER_HOUR) {
      return { allowed: false, reason: `MAX_POSTS_PER_HOUR limit reached (${config.MAX_POSTS_PER_HOUR})` };
    }

    const publicationsLastDay = await prisma.publicationRecord.count({
      where: {
        channel: channel as any,
        createdAt: { gte: oneDayAgo },
        status: { in: ['PUBLISHED', 'PUBLISHING'] }
      }
    });

    if (publicationsLastDay >= config.MAX_POSTS_PER_DAY) {
      return { allowed: false, reason: `MAX_POSTS_PER_DAY limit reached (${config.MAX_POSTS_PER_DAY})` };
    }

    // 2. Check time since last post (MIN_SECONDS_BETWEEN_POSTS)
    const lastPublication = await prisma.publicationRecord.findFirst({
      where: { channel: channel as any, status: { in: ['PUBLISHED', 'PUBLISHING'] } },
      orderBy: { createdAt: 'desc' }
    });

    if (lastPublication) {
      const secondsSinceLast = (now.getTime() - lastPublication.createdAt.getTime()) / 1000;
      if (secondsSinceLast < config.MIN_SECONDS_BETWEEN_POSTS) {
        return { allowed: false, reason: `Too soon. Minimum ${config.MIN_SECONDS_BETWEEN_POSTS}s between posts.` };
      }
    }

    // 3. Check Product Cooldown
    const productCooldownTime = new Date(now.getTime() - config.PRODUCT_COOLDOWN_MINUTES * 60 * 1000);
    const recentProductPost = await prisma.publicationRecord.findFirst({
      where: {
        productId,
        channel: channel as any,
        createdAt: { gte: productCooldownTime },
        status: { in: ['PUBLISHED', 'PUBLISHING'] }
      }
    });

    if (recentProductPost) {
      return { allowed: false, reason: `Product is in cooldown for this channel.` };
    }

    // 4. Check Category Cooldown (Diversity)
    if (category) {
      const categoryCooldownTime = new Date(now.getTime() - config.CATEGORY_COOLDOWN_MINUTES * 60 * 1000);
      
      // Look up recently published products to check their category
      const recentCategoryPosts = await prisma.publicationRecord.findMany({
        where: {
          channel: channel as any,
          createdAt: { gte: categoryCooldownTime },
          status: { in: ['PUBLISHED', 'PUBLISHING'] }
        },
        select: { productId: true }
      });

      if (recentCategoryPosts.length > 0) {
        const productIds = recentCategoryPosts.map(p => p.productId);
        const categoryProducts = await prisma.product.findMany({
          where: { id: { in: productIds }, category }
        });
        if (categoryProducts.length > 0) {
          return { allowed: false, reason: `Category '${category}' is in cooldown.` };
        }
      }
    }

    // 5. Check Brand / Seller Cooldown (Diversity)
    if (brand) {
      const sellerCooldownTime = new Date(now.getTime() - config.SELLER_COOLDOWN_MINUTES * 60 * 1000);
      
      const recentSellerPosts = await prisma.publicationRecord.findMany({
        where: {
          channel: channel as any,
          createdAt: { gte: sellerCooldownTime },
          status: { in: ['PUBLISHED', 'PUBLISHING'] }
        },
        select: { productId: true }
      });

      if (recentSellerPosts.length > 0) {
        const productIds = recentSellerPosts.map(p => p.productId);
        const sellerProducts = await prisma.product.findMany({
          where: { id: { in: productIds }, brand }
        });
        if (sellerProducts.length > 0) {
          return { allowed: false, reason: `Brand/Seller '${brand}' is in cooldown.` };
        }
      }
    }

    return { allowed: true };
  }
}
