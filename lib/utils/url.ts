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

// Mapeamento de emergência para converter produtos legados/mocks de teste em ASINs reais da Amazon BR
const REAL_ASIN_MAP: Record<string, string> = {
  'B07XQ8P6S1': 'B077BG228H', // Café Orfeu Gourmet Intenso 250g (ASIN Real da Amazon BR)
  'B07MSLFF61': 'B08S3P3GCS', // Whey Protein Max Titanium (ASIN Real da Amazon BR)
};

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

export function getSanitizedProductUrl(product: ProductUrlPayload): string {
  if (!product) return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;

  let cleanId = (product.externalId || product.asin || product.id || '').toString().trim().toUpperCase();

  // 1. Mapeamento de ASINs de teste para ASINs reais na Amazon BR
  if (REAL_ASIN_MAP[cleanId]) {
    cleanId = REAL_ASIN_MAP[cleanId];
  }

  // Se o ASIN for válido e real (10 caracteres) -> VAI DIRETO PARA A PÁGINA DO PRODUTO (/dp/ASIN)
  if (/^[A-Z0-9]{10}$/.test(cleanId) && cleanId !== 'ASIN123456') {
    return `https://www.amazon.com.br/dp/${cleanId}?tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 2. Fallback de Busca por Título Sanitizado (Sem aspas que quebram a busca)
  if (product.title && product.title.trim().length > 0) {
    const cleanTitle = product.title.replace(/["']/g, '').trim();
    const searchQuery = encodeURIComponent(cleanTitle);
    return `https://www.amazon.com.br/s?k=${searchQuery}&tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 3. Fallback de suporte a outros marketplaces pelo ID
  let rawId = (product.externalId || product.asin || product.id || '').toString().trim();
  const sanitizedId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  if (sanitizedId.length > 0 && product.platform) {
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

  return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;
}

export function getSanitizedAffiliateUrl(product: ProductUrlPayload, defaultTag = 'thomazpromos-20'): string {
  return getSanitizedProductUrl(product);
}
