import { prisma } from "../../lib/prisma";

export interface AnalyticsOverview {
  totalClicks: number;
  clicksLast24h: number;
  totalConversions: number;
  totalRevenue: number;
  epc: number;
}

export interface ChannelPerformance {
  channelId: string | null;
  clicks: number;
}

export interface MarketplacePerformance {
  marketplace: string | null;
  clicks: number;
}

export class MetricsEngine {
  /**
   * Retrieves high-level click overview
   */
  public static async getOverview(): Promise<AnalyticsOverview> {
    const totalClicks = await prisma.clickEvent.count();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const clicksLast24h = await prisma.clickEvent.count({
      where: {
        clickedAt: {
          gte: yesterday,
        },
      },
    });

    const totalConversions = await prisma.conversion.count({
      where: { status: 'CONFIRMED' }
    });

    const totalRevenueAgg = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { status: 'APPROVED' }
    });

    const totalRevenue = totalRevenueAgg._sum.amount || 0;
    const epc = totalClicks > 0 ? totalRevenue / totalClicks : 0;

    return {
      totalClicks,
      clicksLast24h,
      totalConversions,
      totalRevenue,
      epc
    };
  }

  public static calculateKPIs(impressions: number, clicks: number, conversions: number, revenue: number) {
    const ctr = impressions > 0 ? clicks / impressions : 0;
    const cvr = clicks > 0 ? conversions / clicks : 0;
    const epc = clicks > 0 ? revenue / clicks : 0;
    return { ctr, cvr, epc };
  }

  /**
   * Retrieves performance grouped by channel
   */
  public static async getChannelPerformance(): Promise<ChannelPerformance[]> {
    const channelStats = await prisma.clickEvent.groupBy({
      by: ["channelId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    return channelStats.map((stat) => ({
      channelId: stat.channelId,
      clicks: stat._count.id,
    }));
  }

  /**
   * Retrieves performance grouped by marketplace
   */
  public static async getMarketplacePerformance(): Promise<MarketplacePerformance[]> {
    const marketplaceStats = await prisma.clickEvent.groupBy({
      by: ["marketplace"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    return marketplaceStats.map((stat) => ({
      marketplace: stat.marketplace,
      clicks: stat._count.id,
    }));
  }
}
