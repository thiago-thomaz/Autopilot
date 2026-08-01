import { OmnichannelChannel } from '@prisma/client';
import { BasePublicationAdapter } from './adapters/BasePublicationAdapter';
import { MockPublicationAdapter } from './adapters/MockPublicationAdapter';
import { InstagramPublicationAdapter } from './adapters/InstagramPublicationAdapter';
import { FacebookPagesPublicationAdapter } from './adapters/FacebookPagesPublicationAdapter';
import { TikTokPublicationAdapter } from './adapters/TikTokPublicationAdapter';
import { YouTubePublicationAdapter } from './adapters/YouTubePublicationAdapter';
import { PinterestPublicationAdapter } from './adapters/PinterestPublicationAdapter';
import { XPublicationAdapter } from './adapters/XPublicationAdapter';
import { ThreadsPublicationAdapter } from './adapters/ThreadsPublicationAdapter';
import { WhatsAppPublicationAdapter } from './adapters/WhatsAppPublicationAdapter';
import { TelegramPublicationAdapter } from './adapters/TelegramPublicationAdapter';
import { SnapchatPublicationAdapter } from './adapters/SnapchatPublicationAdapter';
import { LinkedInPublicationAdapter } from './adapters/LinkedInPublicationAdapter';
import { GoogleBusinessPublicationAdapter } from './adapters/GoogleBusinessPublicationAdapter';
import { RedditPublicationAdapter } from './adapters/RedditPublicationAdapter';
import { DiscordPublicationAdapter } from './adapters/DiscordPublicationAdapter';
import { BlogPublicationAdapter } from './adapters/BlogPublicationAdapter';
import { EmailPublicationAdapter } from './adapters/EmailPublicationAdapter';
import { WebPushPublicationAdapter } from './adapters/WebPushPublicationAdapter';
import { RssPublicationAdapter } from './adapters/RssPublicationAdapter';
import { OwnWebsitePublicationAdapter } from './adapters/OwnWebsitePublicationAdapter';

export class PublicationAdapterFactory {
  /**
   * Instancia o adapter adequado para cada um dos 20 canais omnichannel.
   */
  public static getAdapter(channel: OmnichannelChannel): BasePublicationAdapter {
    if (process.env.AFFILIATE_MOCK_MODE === 'true' || process.env.MOCK_PUBLICATION === 'true') {
      return new MockPublicationAdapter(channel);
    }

    switch (channel) {
      case 'INSTAGRAM': return new InstagramPublicationAdapter();
      case 'FACEBOOK_PAGES': return new FacebookPagesPublicationAdapter();
      case 'TIKTOK': return new TikTokPublicationAdapter();
      case 'YOUTUBE':
      case 'YOUTUBE_SHORTS': return new YouTubePublicationAdapter();
      case 'PINTEREST': return new PinterestPublicationAdapter();
      case 'X': return new XPublicationAdapter();
      case 'THREADS': return new ThreadsPublicationAdapter();
      case 'WHATSAPP': return new WhatsAppPublicationAdapter();
      case 'TELEGRAM': return new TelegramPublicationAdapter();
      case 'SNAPCHAT': return new SnapchatPublicationAdapter();
      case 'LINKEDIN_PAGES': return new LinkedInPublicationAdapter();
      case 'GOOGLE_BUSINESS_PROFILE': return new GoogleBusinessPublicationAdapter();
      case 'REDDIT': return new RedditPublicationAdapter();
      case 'DISCORD': return new DiscordPublicationAdapter();
      case 'BLOG': return new BlogPublicationAdapter();
      case 'EMAIL': return new EmailPublicationAdapter();
      case 'WEB_PUSH': return new WebPushPublicationAdapter();
      case 'RSS': return new RssPublicationAdapter();
      case 'OWN_WEBSITE': return new OwnWebsitePublicationAdapter();
      default:
        return new MockPublicationAdapter(channel);
    }
  }
}
