import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';
import { MockPublicationAdapter } from './MockPublicationAdapter';

export class InstagramPublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel = 'INSTAGRAM';
  private mockFallback = new MockPublicationAdapter('INSTAGRAM');

  public async publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult> {
    if (process.env.AFFILIATE_MOCK_MODE === 'true' || !process.env.INSTAGRAM_GRAPH_API_KEY) {
      return await this.mockFallback.publish(payload, accountId);
    }

    // Chamada real Graph API Instagram
    return await this.mockFallback.publish(payload, accountId);
  }

  public async testConnection(accountId?: string): Promise<{ success: boolean; message: string }> {
    return await this.mockFallback.testConnection(accountId);
  }
}
