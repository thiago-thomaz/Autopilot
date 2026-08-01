import { HreflangTag } from '../../types/global/localization.types';

export interface LocalizedSEOPayload {
  canonicalUrl: string;
  hreflangTags: HreflangTag[];
  localizedMetaTitle: string;
  localizedMetaDescription: string;
}

export class GlobalSEOEngine {
  public generateSEOConfig(
    slug: string,
    country: string,
    language: string,
    title: string,
    description: string
  ): LocalizedSEOPayload {
    const c = country.toLowerCase();
    const l = language.toLowerCase().split('-')[0];
    const baseUrl = 'https://affiliateautopilot.com';

    const canonicalUrl = `${baseUrl}/${c}/${slug}`;

    // Supported multi-market hreflang matrix
    const hreflangTags: HreflangTag[] = [
      { lang: 'en-us', url: `${baseUrl}/us/${slug}` },
      { lang: 'en-gb', url: `${baseUrl}/uk/${slug}` },
      { lang: 'pt-br', url: `${baseUrl}/br/${slug}` },
      { lang: 'de-de', url: `${baseUrl}/de/${slug}` },
      { lang: 'es-es', url: `${baseUrl}/es/${slug}` },
      { lang: 'x-default', url: `${baseUrl}/us/${slug}` }
    ];

    return {
      canonicalUrl,
      hreflangTags,
      localizedMetaTitle: `${title} | International Deal (${country.toUpperCase()})`,
      localizedMetaDescription: `${description.slice(0, 150)}... Buy with official warranty in ${country.toUpperCase()}.`
    };
  }
}
