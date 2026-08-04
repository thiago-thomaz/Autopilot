import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class TelegramActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'TELEGRAM';

  public static async sendMessage(caption: string, mediaUrl?: string): Promise<{ success: boolean; messageId?: string }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('[TelegramAdapter] Credenciais TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID ausentes no .env.');
      return { success: false };
    }

    try {
      const endpoint = mediaUrl
        ? `https://api.telegram.org/bot${botToken}/sendPhoto`
        : `https://api.telegram.org/bot${botToken}/sendMessage`;

      const payload = mediaUrl
        ? { chat_id: chatId, photo: mediaUrl, caption, parse_mode: 'HTML' }
        : { chat_id: chatId, text: caption, parse_mode: 'HTML' };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.description || 'Falha no envio da mensagem ao Telegram.');
      }

      return { success: true, messageId: data.result?.message_id?.toString() };
    } catch (error: any) {
      console.error('[TelegramAdapter] Erro ao enviar mensagem ao Telegram:', error.message);
      return { success: false };
    }
  }

  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    const caption = step.payload?.caption || step.payload?.text || `Telegram action ${step.actionType}`;
    const mediaUrl = step.payload?.imageUrl || step.payload?.mediaUrl;
    const res = await TelegramActionAdapter.sendMessage(caption, mediaUrl);
    
    return { 
      success: res.success, 
      platform: this.platformName, 
      response: { messageId: res.messageId, step } 
    };
  }

  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Telegram action ${step.actionType} rolled back`, step } };
  }
}

