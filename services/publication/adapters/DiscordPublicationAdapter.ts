import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';
import { MockPublicationAdapter } from './MockPublicationAdapter';

export class DiscordPublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel = 'DISCORD';
  private mockFallback = new MockPublicationAdapter('DISCORD');

  public async publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult> {
    return await this.mockFallback.publish(payload, accountId);
  }

  public async testConnection(accountId?: string): Promise<{ success: boolean; message: string }> {
    return await this.mockFallback.testConnection(accountId);
  }
}
