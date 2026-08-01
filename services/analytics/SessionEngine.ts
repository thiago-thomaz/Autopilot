import { prisma } from '../../lib/prisma';

export class SessionEngine {
  public static async getOrCreateSession(anonymousId: string, source?: string, campaign?: string) {
    const activeSession = await prisma.analyticsSession.findFirst({
      where: {
        anonymousId,
        endedAt: null,
      },
      orderBy: { lastActivityAt: 'desc' },
    });

    if (activeSession) {
      await prisma.analyticsSession.update({
        where: { id: activeSession.id },
        data: { lastActivityAt: new Date() },
      });
      return activeSession;
    }

    return await prisma.analyticsSession.create({
      data: {
        anonymousId,
        firstSource: source || 'DIRECT',
        firstCampaign: campaign || 'NONE',
        lastSource: source || 'DIRECT',
        lastCampaign: campaign || 'NONE',
      },
    });
  }
}
