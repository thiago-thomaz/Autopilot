import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';
import { MockPublicationAdapter } from './MockPublicationAdapter';

export class EmailPublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel = 'EMAIL';
  private mockFallback = new MockPublicationAdapter('EMAIL');

  public async publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult> {
    return await this.mockFallback.publish(payload, accountId);
  }

  public async testConnection(accountId?: string): Promise<{ success: boolean; message: string }> {
    return await this.mockFallback.testConnection(accountId);
  }
}
