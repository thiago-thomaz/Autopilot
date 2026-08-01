import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';

export class MockPublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel;

  constructor(channel: OmnichannelChannel = 'INSTAGRAM') {
    super();
    this.channel = channel;
  }

  public async publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult> {
    const isMockMode = process.env.AFFILIATE_MOCK_MODE === 'true' || process.env.MOCK_PUBLICATION === 'true';

    // Plataformas sem API oficial aberta de envio automático acionam MANUAL_REQUIRED
    if (this.channel === 'REDDIT') {
      return {
        success: true,
        status: 'MANUAL_REQUIRED',
        publicationType: 'MANUAL',
        manualPackage: {
          platform: 'Reddit',
          whyManualReason: 'A publicação direta exige aprovação humana da comunidade e regras estritas anti-spam do subreddit.',
          formattedText: `**${payload.title}**\n\n${payload.body}\n\n[Link Oficial](${payload.trackingUrl})`,
          mediaUrls: payload.mediaUrls || [],
          trackingUrl: payload.trackingUrl,
          instructions: 'Copie a postagem formatada, acesse o subreddit desejado e cole manualmente respeitando os termos do fórum.',
        },
      };
    }

    const mockExtId = `pub_mock_${this.channel.toLowerCase()}_${Date.now()}`;
    let mockUrl = `https://mock.autopilot.com/p/${mockExtId}`;

    if (this.channel === 'INSTAGRAM') mockUrl = `https://instagram.com/p/${mockExtId}`;
    else if (this.channel === 'TELEGRAM') mockUrl = `https://t.me/channel_demo/${mockExtId}`;
    else if (this.channel === 'YOUTUBE' || this.channel === 'YOUTUBE_SHORTS') mockUrl = `https://youtube.com/shorts/${mockExtId}`;
    else if (this.channel === 'OWN_WEBSITE') mockUrl = `http://localhost:3000/deals/kindle-paperwhite-demo`;

    return {
      success: true,
      status: 'PUBLISHED',
      publicationType: 'AUTOMATIC',
      externalPublicationId: mockExtId,
      externalUrl: mockUrl,
    };
  }

  public async testConnection(accountId?: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: `Conexão MOCK com o canal '${this.channel}' validada com sucesso.` };
  }
}
