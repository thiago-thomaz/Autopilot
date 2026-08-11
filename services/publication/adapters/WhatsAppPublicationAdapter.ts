import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';
import { MockPublicationAdapter } from './MockPublicationAdapter';
import { env } from 'process';

export class WhatsAppPublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel = 'WHATSAPP';
  private mockFallback = new MockPublicationAdapter('WHATSAPP');

  private get apiUrl() {
    return env.EVOLUTION_API_URL;
  }
  
  private get apiKey() {
    return env.EVOLUTION_API_KEY;
  }
  
  private get instanceName() {
    return env.EVOLUTION_INSTANCE_NAME || 'AffiliateAutopilot';
  }

  public async publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult> {
    if (env.DRY_RUN === 'true' || !this.apiUrl || !this.apiKey) {
      console.log(`[WHATSAPP_ADAPTER] Dry run or missing keys. Mocking publication to ${accountId || 'default'}.`);
      return await this.mockFallback.publish(payload, accountId);
    }

    try {
      const targetPhone = accountId || env.DEFAULT_WHATSAPP_GROUP;
      if (!targetPhone) {
        throw new Error('No target WhatsApp account or group configured.');
      }

      const messageText = `${payload.title}\n\n${payload.body}\n\n🛒 Acesse a oferta: ${payload.trackingUrl}`;
      
      let endpoint = `${this.apiUrl}/message/sendText/${this.instanceName}`;
      let body: any = {
        number: targetPhone,
        options: {
          delay: 1200,
          presence: "composing",
        },
        textMessage: {
          text: messageText,
        },
      };

      if (payload.mediaUrls && payload.mediaUrls.length > 0) {
        endpoint = `${this.apiUrl}/message/sendMedia/${this.instanceName}`;
        body = {
          number: targetPhone,
          options: {
            delay: 1200,
            presence: "composing",
          },
          mediaMessage: {
            mediatype: "image",
            caption: messageText,
            media: payload.mediaUrls[0],
          },
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Evolution API Error ${response.status}: ${errText}`);
      }

      const data = await response.json();

      return {
        success: true,
        status: 'PUBLISHED',
        externalPublicationId: data.key?.id || `wa_${Date.now()}`,
        externalUrl: `https://wa.me/${targetPhone}`,
      };
    } catch (error: any) {
      console.error(`[WHATSAPP_ADAPTER_ERROR] ${error.message}`);
      return {
        success: false,
        status: 'FAILED',
        errorMessage: error.message,
      };
    }
  }

  public async testConnection(accountId?: string): Promise<{ success: boolean; message: string }> {
    if (!this.apiUrl || !this.apiKey) {
      return { success: false, message: 'Evolution API credentials not configured.' };
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/instance/connectionState/${this.instanceName}`, {
        headers: { 'apikey': this.apiKey }
      });
      
      if (response.ok) {
        return { success: true, message: 'Evolution API connected.' };
      }
      return { success: false, message: `Failed to connect. Status: ${response.status}` };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
}
