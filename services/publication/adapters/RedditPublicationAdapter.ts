import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';
import { MockPublicationAdapter } from './MockPublicationAdapter';

export class RedditPublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel = 'REDDIT';
  private mockFallback = new MockPublicationAdapter('REDDIT');

  public async publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult> {
    // Reddit exige postagem manual para aprovação da comunidade e prevenção de bans
    return await this.mockFallback.publish(payload, accountId);
  }

  public async testConnection(accountId?: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Reddit exige publicação manual com aprovação humana (MANUAL_REQUIRED).' };
  }
}
