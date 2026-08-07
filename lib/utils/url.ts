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
  },
  MERCADO_LIVRE: {
    domain: 'https://www.mercadolivre.com.br',
  },
  SHOPEE: {
    domain: 'https://shopee.com.br',
  },
  ALIEXPRESS: {
    domain: 'https://pt.aliexpress.com',
  },
  MAGALU: {
    domain: 'https://www.magazineluiza.com.br',
  },
  DEFAULT_DOMAIN: 'https://www.amazon.com.br',
};

export function getSanitizedProductUrl(product: ProductUrlPayload): string {
  if (!product) return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;

  if (product.platform === 'MERCADO_LIVRE' && product.externalId) {
    return `https://www.mercadolivre.com.br/p/${product.externalId}`;
  }

  const asin = product.externalId || product.asin;
  if (asin && asin.length === 10) {
    return `https://www.amazon.com.br/dp/${asin}?tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 1. ENGINE DE BUSCA INTELIGENTE E LIMPA (Aplica para todos os produtos)
  if (product.title && product.title.trim().length > 0) {
    // Limpa aspas, parênteses, palavras de stop-words e gramaturas exatas que travam a busca da Amazon
    const cleanedTitle = product.title
      .replace(/["'""'']/g, '') // Remove aspas que travam a busca exata
      .replace(/[\(\)\[\]\{\}]/g, ' ') // Remove parênteses e colchetes
      .replace(/\b(250g|500g|1kg|900g|1000g|ml|l)\b/gi, '') // Remove gramaturas rígidas
      .replace(/\s+/g, ' ') // Remove espaços duplicados
      .trim();

    // Pega as primeiras 5 palavras principais para uma busca ampla e precisa
    const words = cleanedTitle.split(' ').slice(0, 5).join(' ');

    const searchQuery = encodeURIComponent(words);
    return `https://www.amazon.com.br/s?k=${searchQuery}&tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 2. Fallback de emergência caso não exista título
  return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;
}

export function getSanitizedAffiliateUrl(product: ProductUrlPayload, defaultTag = 'thomazpromos-20'): string {
  return getSanitizedProductUrl(product);
}
