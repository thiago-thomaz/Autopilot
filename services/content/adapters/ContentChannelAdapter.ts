import { GeneratedContentOutput } from '../../../types/content/content.types';
import { ChannelPlatform } from '@prisma/client';

export class ContentChannelAdapter {
  /**
   * Formata a visualização de preview para um canal específico.
   */
  public static formatPreview(content: GeneratedContentOutput, channel: ChannelPlatform | string): { formattedText: string; mediaType: string } {
    switch (channel as string) {
      case 'INSTAGRAM':
        return {
          formattedText: `📸 [POST INSTAGRAM]\n\n${content.hook}\n\n${content.caption}\n\n${content.hashtags.join(' ')}`,
          mediaType: 'CAROUSEL_OR_IMAGE',
        };
      case 'TIKTOK':
      case 'YOUTUBE':
      case 'YOUTUBE_SHORTS':
        return {
          formattedText: `🎬 [ROTEIRO VÍDEO CURTO - 9:16]\n\nHook: "${content.hook}"\n\n` +
            (content.script || []).map((s) => `[${s.timeRange}] ${s.narration}\nVisual: ${s.visualPrompt}`).join('\n\n'),
          mediaType: 'SHORT_VIDEO_9_16',
        };
      case 'TELEGRAM':
        return {
          formattedText: `✈️ [TELEGRAM DEAL]\n\n<b>${content.title}</b>\n\n${content.caption}\n\n🔗 <i>${content.cta}</i>`,
          mediaType: 'TELEGRAM_MESSAGE',
        };
      case 'WORDPRESS':
        return {
          formattedText: `📝 [ARTIGO BLOG WORDPRESS]\n\n<h1>${content.title}</h1>\n<h2>${content.subtitle}</h2>\n<p>${content.longDescription}</p>\n<ul>${(content.bullets || []).map((b) => `<li>${b}</li>`).join('')}</ul>`,
          mediaType: 'BLOG_HTML',
        };
      default:
        return {
          formattedText: content.caption,
          mediaType: 'TEXT',
        };
    }
  }
}
