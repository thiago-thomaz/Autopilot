import { prisma } from '../../lib/prisma';
import { TrafficQualityEngine } from './TrafficQualityEngine';

export class TrackingRedirectService {
  public static async recordClickAndGetRedirect(trackingId: string, destination: string, channel?: string, userAgent?: string) {
    const { qualityScore, isBot } = TrafficQualityEngine.evaluateClickQuality(userAgent);

    const click = await prisma.analyticsClick.create({
      data: {
        trackingId,
        destination,
        channel,
        status: isBot ? 'BOT' : 'VALID',
        qualityScore,
      },
    });

    return { click, destination };
  }
}
