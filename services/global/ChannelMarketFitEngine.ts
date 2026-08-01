export class ChannelMarketFitEngine {
  public getTopChannelsForCountry(country: string): string[] {
    const code = country.toUpperCase();
    switch (code) {
      case 'US':
        return ['INSTAGRAM', 'TIKTOK', 'YOUTUBE_SHORTS', 'PINTEREST', 'BLOG'];
      case 'BR':
        return ['WHATSAPP', 'TELEGRAM', 'INSTAGRAM', 'YOUTUBE_SHORTS'];
      case 'DE':
        return ['BLOG', 'YOUTUBE', 'FACEBOOK_PAGES', 'EMAIL'];
      case 'JP':
        return ['LINE', 'X', 'YOUTUBE', 'BLOG'];
      default:
        return ['INSTAGRAM', 'YOUTUBE', 'BLOG'];
    }
  }
}
