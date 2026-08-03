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

  const rawUrl = product.affiliateUrl || product.originalUrl || product.url || '';

  // Se a URL salva no banco for um link direto /dp/ ou /gp/ da Amazon, ignoramos para forçar a busca por título
  const isDirectDpLink = typeof rawUrl === 'string' && (rawUrl.includes('/dp/') || rawUrl.includes('/gp/'));

  // 1. Para outros links válidos (como Mercado Livre) que não sejam links diretos da Amazon
  if (!isDirectDpLink && rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && !rawUrl.includes('mock')) {
    return rawUrl.trim();
  }

  // 2. Fallback Obrigatório por Título na Amazon
  if (product.title && product.title.trim().length > 0) {
    const searchQuery = encodeURIComponent(product.title.trim());
    return `https://www.amazon.com.br/s?k=${searchQuery}&tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 3. Suporte a fallback de ID de outros marketplaces
  let cleanId = (product.externalId || product.asin || product.id || '').toString().trim();
  const sanitizedId = cleanId.replace(/[^a-zA-Z0-9_-]/g, '');

  if (sanitizedId.length > 0 && !isDirectDpLink) {
    const platformRaw = (product.platform || '').toString().toUpperCase().replace(/[-_]/g, '');

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

  return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;
}

export function getSanitizedAffiliateUrl(product: ProductUrlPayload, defaultTag = 'thomazpromos-20'): string {
  return getSanitizedProductUrl(product);
}
