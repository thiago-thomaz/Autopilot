import { BasePublicationAdapter } from './BasePublicationAdapter';
import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';
import { TelegramActionAdapter } from '../../automation/adapters/TelegramActionAdapter';

export class TelegramPublicationAdapter extends BasePublicationAdapter {
  public readonly channel: OmnichannelChannel = 'TELEGRAM';

  public async publish(payload: PublicationPayload, _accountId?: string): Promise<PublicationResult> {
    const caption = payload.body || payload.title || '';
    const mediaUrl = payload.mediaUrls && payload.mediaUrls.length > 0 ? payload.mediaUrls[0] : undefined;
    const res = await TelegramActionAdapter.sendMessage(caption, mediaUrl);

    if (res.success) {
      return {
        success: true,
        externalPublicationId: res.messageId,
        status: 'PUBLISHED',
      };
    } else {
      return {
        success: false,
        status: 'FAILED',
        errorMessage: 'Erro no envio da mensagem ao Telegram Bot API.',
      };
    }
  }

  public async testConnection(_accountId?: string): Promise<{ success: boolean; message: string }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
      return { success: false, message: 'TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID ausentes no .env' };
    }
    return { success: true, message: 'Credenciais presentes' };
  }
}

