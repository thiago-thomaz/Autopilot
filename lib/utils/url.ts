/**
 * Engine Universal de Links de Afiliados Multi-Marketplace.
 * Suporte para Amazon, Mercado Livre, Shopee, AliExpress, Magalu e outros marketplaces.
 */

export interface ProductUrlPayload {
  url?: string;
  originalUrl?: string;
  affiliateUrl?: string;
  original_url?: string;
  affiliate_url?: string;
  externalId?: string;
  asin?: string;
  id?: string;
  platform?: 'AMAZON' | 'MERCADO_LIVRE' | 'SHOPEE' | 'ALIEXPRESS' | 'MAGALU' | string;
  title?: string;
}

const DEFAULT_AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_PARTNER_TAG || 'thomazpromos-20';

// Configuração centralizada de Tags e IDs de Afiliado por Marketplace
export const AFFILIATE_CONFIG = {
  AMAZON: {
    tag: DEFAULT_AMAZON_TAG,
    domain: 'https://www.amazon.com.br',
    buildFallback: (id: string) => `${AFFILIATE_CONFIG.AMAZON.domain}/dp/${id}?tag=${AFFILIATE_CONFIG.AMAZON.tag}`,
  },
  MERCADO_LIVRE: {
    domain: 'https://www.mercadolivre.com.br',
    buildFallback: (id: string) => `${AFFILIATE_CONFIG.MERCADO_LIVRE.domain}/p/${id}`,
  },
  SHOPEE: {
    domain: 'https://shopee.com.br',
    buildFallback: (id: string) => `${AFFILIATE_CONFIG.SHOPEE.domain}/product/${id}`,
  },
  ALIEXPRESS: {
    domain: 'https://pt.aliexpress.com',
    buildFallback: (id: string) => `${AFFILIATE_CONFIG.ALIEXPRESS.domain}/item/${id}.html`,
  },
  MAGALU: {
    domain: 'https://www.magazineluiza.com.br',
    buildFallback: (id: string) => `${AFFILIATE_CONFIG.MAGALU.domain}/p/${id}`,
  },
  DEFAULT_DOMAIN: 'https://www.amazon.com.br',
};

/**
 * Sanitiza e garante URL de afiliado válida no mundo real (Amazon, ML, Shopee, etc.)
 */
export function getSanitizedProductUrl(product: ProductUrlPayload): string {
  if (!product) return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;

  // 1. Se houver uma URL direta VÁLIDA da API que não seja um mock antigo
  const rawUrl = product.affiliateUrl || product.originalUrl || product.url;
  if (
    rawUrl &&
    typeof rawUrl === 'string' &&
    rawUrl.startsWith('http') &&
    !rawUrl.includes('/dp/B07XQ8P6S1') &&
    !rawUrl.includes('/dp/B07MSLFF61') &&
    !rawUrl.includes('ASIN123')
  ) {
    let cleanUrl = rawUrl.trim();
    try {
      const parsed = new URL(cleanUrl);
      if (parsed.hostname.includes('amazon.')) {
        parsed.searchParams.set('tag', DEFAULT_AMAZON_TAG);
        return parsed.toString();
      }
      if (parsed.hostname.includes('mercadolivre.') || parsed.hostname.includes('mercadolibre.')) {
        if (!parsed.searchParams.has('p') && !parsed.searchParams.has('matt_tool')) {
          parsed.searchParams.set('p', `ml_afiliado_${DEFAULT_AMAZON_TAG}`);
        }
        return parsed.toString();
      }
      return cleanUrl;
    } catch {
      return cleanUrl;
    }
  }

  // 2. REGRA MESTRA ANTI-404: Se houver título, SEMPRE gera a Busca Qualificada da Amazon
  if (product.title && product.title.trim().length > 0) {
    const searchQuery = encodeURIComponent(product.title.trim());
    return `https://www.amazon.com.br/s?k=${searchQuery}&tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 3. Fallbacks de segurança (busca pelo ID ou página inicial)
  let cleanId = (product.externalId || product.asin || product.id || '').toString().trim();
  const sanitizedId = cleanId.replace(/[^a-zA-Z0-9_-]/g, '');

  if (sanitizedId.length > 0) {
    // Suporte a outros marketplaces
    if (product.platform) {
      const platformRaw = product.platform.toString().toUpperCase().replace(/[-_]/g, '');
      if (platformRaw.includes('MERCADO') || platformRaw.includes('MELI')) {
        return `https://www.mercadolivre.com.br/p/${sanitizedId}`;
      }
      if (platformRaw.includes('SHOPEE')) {
        return `https://shopee.com.br/product/${sanitizedId}`;
      }
      if (platformRaw.includes('ALIEXPRESS')) {
        return `https://pt.aliexpress.com/item/${sanitizedId}.html`;
      }
      if (platformRaw.includes('MAGALU') || platformRaw.includes('MAGAZINE')) {
        return `https://www.magazineluiza.com.br/p/${sanitizedId}`;
      }
    }
    // Para a Amazon, busca por ID
    return `https://www.amazon.com.br/s?k=${encodeURIComponent(sanitizedId)}&tag=${DEFAULT_AMAZON_TAG}`;
  }

  return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;
}

export function getSanitizedAffiliateUrl(product: ProductUrlPayload, defaultTag = 'thomazpromos-20'): string {
  return getSanitizedProductUrl(product);
}
