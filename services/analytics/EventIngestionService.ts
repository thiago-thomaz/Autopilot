import { prisma } from '../../lib/prisma';

export class EventIngestionService {
  public static async ingestEvent(eventData: any) {
    return await prisma.analyticsEvent.create({
      data: {
        eventType: eventData.eventType || 'CLICK',
        eventSource: eventData.eventSource || 'WEB',
        eventSourceId: eventData.eventSourceId,
        trackingId: eventData.trackingId,
        channel: eventData.channel,
        country: eventData.country || 'BR',
        currency: eventData.currency || 'BRL',
        metadata: eventData.metadata,
      },
    });
  }
}
