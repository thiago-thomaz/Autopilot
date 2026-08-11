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
  affiliatePlatformId?: string;
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

  // Mercado Livre - Usa URL direta se existir
  const platform = product.platform || product.affiliatePlatformId;
  if (platform === 'MERCADO_LIVRE' || platform === 'mercado-livre') {
    if (product.url && product.url.includes('mercadolivre.com.br')) {
      return product.url;
    }
    if (product.originalUrl && product.originalUrl.includes('mercadolivre.com.br')) {
      return product.originalUrl;
    }
    if (product.externalId) {
      return `https://www.mercadolivre.com.br/p/${product.externalId.replace('-', '')}`;
    }
  }

  // Amazon - Extrai ASIN da URL caso não esteja explícito
  let asin = product.externalId || product.asin;
  
  if (!asin || asin.length !== 10) {
    const urlsToSearch = [product.url, product.originalUrl, product.affiliateUrl].filter(Boolean) as string[];
    for (const url of urlsToSearch) {
      const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
      if (match && match[1]) {
        asin = match[1];
        break;
      }
    }
  }

  const dummyAsins = ['B07XQ8P6S1', 'B08F9N12KL', 'ASIN123'];
  const isDummyAsin = asin && dummyAsins.includes(asin);

  if (asin && asin.length === 10 && !isDummyAsin) {
    return `https://www.amazon.com.br/dp/${asin}?tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 1. ENGINE DE BUSCA INTELIGENTE E LIMPA (Aplica como fallback SE NÃO HOUVER ASIN ou FOR ASIN FICTÍCIO)
  if (product.title && product.title.trim().length > 0) {
    // Limpa caracteres rígidos para evitar erro de busca e montagem de query segura
    const cleanKeywords = product.title
      .replace(/\[.*?\]/g, '') // Remove tags entre colchetes como [OFERTA]
      .replace(/["'“”\(\)\[\]\{\}]/g, '')
      .replace(/-\s*Amazon/gi, '')
      .replace(/-\s*Mercado\s*Livre/gi, '')
      .replace(/\b(250g|500g|1kg|900g|1000g|ml|l)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 5)
      .join(' ');

    const searchQuery = encodeURIComponent(cleanKeywords);
    return `https://www.amazon.com.br/s?k=${searchQuery}&tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 2. Fallback de emergência
  return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;
}

export function getSanitizedAffiliateUrl(product: ProductUrlPayload, defaultTag = 'thomazpromos-20'): string {
  return getSanitizedProductUrl(product);
}
