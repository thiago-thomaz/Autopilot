import { prisma } from '../../lib/prisma';

export class EventDeduplicationService {
  public static async isDuplicateClick(trackingId: string, windowSeconds = 10): Promise<boolean> {
    const timeAgo = new Date(Date.now() - windowSeconds * 1000);
    const existing = await prisma.analyticsClick.findFirst({
      where: {
        trackingId,
        timestamp: { gte: timeAgo },
      },
    });
    return !!existing;
  }
}
