import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';
import { MockPublicationAdapter } from './MockPublicationAdapter';

export class OwnWebsitePublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel = 'OWN_WEBSITE';
  private mockFallback = new MockPublicationAdapter('OWN_WEBSITE');

  public async publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult> {
    const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const url = `http://localhost:3000/deals/${slug}`;

    return {
      success: true,
      status: 'PUBLISHED',
      publicationType: 'AUTOMATIC',
      externalPublicationId: `deal_${slug}`,
      externalUrl: url,
    };
  }

  public async testConnection(accountId?: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Publicação no site próprio ativa.' };
  }
}
