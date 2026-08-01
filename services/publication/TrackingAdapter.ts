export class TrackingAdapter {
  /**
   * Constrói URLs de rastreamento com parâmetros UTM ricos para atribuição precisa.
   */
  public static buildTrackingUrl(
    baseUrl: string,
    channel: string,
    country = 'BR',
    language = 'pt-BR',
    campaignSlug = 'autopilot-default',
    variant = 'v1'
  ): string {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', channel.toLowerCase());
    url.searchParams.set('utm_medium', 'affiliate-social');
    url.searchParams.set('utm_campaign', campaignSlug);
    url.searchParams.set('utm_content', `${country.toLowerCase()}-${language.toLowerCase()}`);
    url.searchParams.set('utm_term', variant);

    return url.toString();
  }
}
