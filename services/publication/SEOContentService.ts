export class SEOContentService {
  /**
   * Gera metadados SEO, schema.org Product/Offer e tags hreflang para internacionalização do site próprio.
   */
  public static generateSEOMetadata(title: string, description: string, price: number, currency = 'BRL', slug = 'oferta') {
    const canonicalUrl = `http://localhost:3000/deals/${slug}`;

    const schemaOrg = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: title,
      description,
      offers: {
        '@type': 'Offer',
        priceCurrency: currency,
        price,
        availability: 'https://schema.org/InStock',
        url: canonicalUrl,
      },
    };

    const hreflangTags = [
      { rel: 'alternate', hreflang: 'pt-BR', href: `${canonicalUrl}?lang=pt-BR` },
      { rel: 'alternate', hreflang: 'en-US', href: `${canonicalUrl}?lang=en-US` },
      { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl },
    ];

    return { canonicalUrl, schemaOrg, hreflangTags };
  }
}
