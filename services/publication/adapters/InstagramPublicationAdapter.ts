import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';
import { MockPublicationAdapter } from './MockPublicationAdapter';
import { env } from 'process';

export class InstagramPublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel = 'INSTAGRAM';
  private mockFallback = new MockPublicationAdapter('INSTAGRAM');

  private get accessToken() {
    return env.INSTAGRAM_ACCESS_TOKEN;
  }
  
  private get igUserId() {
    return env.INSTAGRAM_USER_ID;
  }

  public async publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult> {
    if (env.DRY_RUN === 'true' || !this.accessToken || !this.igUserId) {
      console.log(`[INSTAGRAM_ADAPTER] Dry run or missing tokens. Mocking publication.`);
      return await this.mockFallback.publish(payload, accountId);
    }

    try {
      const targetUserId = accountId || this.igUserId;
      
      if (!payload.mediaUrls || payload.mediaUrls.length === 0) {
        throw new Error('Instagram requires at least one media URL (Image/Video).');
      }

      const imageUrl = payload.mediaUrls[0];
      const caption = `${payload.title}\n\n${payload.body}\n\nLink na BIO ou acesse direto: ${payload.trackingUrl}`;

      const containerUrl = `https://graph.facebook.com/v19.0/${targetUserId}/media`;
      const containerResponse = await fetch(containerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: this.accessToken
        }),
      });

      if (!containerResponse.ok) {
        const errData = await containerResponse.json();
        throw new Error(`Media Container Error: ${JSON.stringify(errData)}`);
      }

      const containerData = await containerResponse.json();
      const creationId = containerData.id;

      const publishUrl = `https://graph.facebook.com/v19.0/${targetUserId}/media_publish`;
      const publishResponse = await fetch(publishUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: this.accessToken
        }),
      });

      if (!publishResponse.ok) {
        const errData = await publishResponse.json();
        throw new Error(`Media Publish Error: ${JSON.stringify(errData)}`);
      }

      const publishData = await publishResponse.json();
      const publishedMediaId = publishData.id;

      return {
        success: true,
        status: 'PUBLISHED',
        externalPublicationId: publishedMediaId,
        externalUrl: `https://www.instagram.com/p/${publishedMediaId}/`,
      };
    } catch (error: any) {
      console.error(`[INSTAGRAM_ADAPTER_ERROR] ${error.message}`);
      return {
        success: false,
        status: 'FAILED',
        errorMessage: error.message,
      };
    }
  }

  public async testConnection(accountId?: string): Promise<{ success: boolean; message: string }> {
    if (!this.accessToken || !this.igUserId) {
      return { success: false, message: 'Instagram API credentials not configured.' };
    }
    
    try {
      const targetUserId = accountId || this.igUserId;
      const url = `https://graph.facebook.com/v19.0/${targetUserId}?fields=id,username&access_token=${this.accessToken}`;
      const response = await fetch(url);
      
      if (response.ok) {
        return { success: true, message: 'Instagram Graph API connected.' };
      }
      return { success: false, message: `Failed to connect. Status: ${response.status}` };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
}
