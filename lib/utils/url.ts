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

  // 1. Se houver uma URL original VÁLIDA emitida por API oficial com domínio Amazon real (e que não seja link mock)
  const rawUrl = product.affiliateUrl || product.originalUrl || product.url;
  if (
    rawUrl &&
    typeof rawUrl === 'string' &&
    rawUrl.startsWith('http') &&
    rawUrl.includes('amazon.com.br') &&
    !rawUrl.includes('/s?k=') &&
    !rawUrl.includes('/dp/B07') &&
    !rawUrl.includes('ASIN123')
  ) {
    try {
      const parsed = new URL(rawUrl);
      parsed.searchParams.set('tag', DEFAULT_AMAZON_TAG);
      return parsed.toString();
    } catch {
      return rawUrl;
    }
  }

  // 2. ENGINE UNIVERSAL DE BUSCA LIMPA (Aplica para 100% dos produtos do catálogo)
  if (product.title && product.title.trim().length > 0) {
    // Sanitiza o título removendo caracteres e ruídos que quebram a busca da Amazon
    const cleanTitle = product.title
      .replace(/["'""'']/g, '') // Remove qualquer tipo de aspas (simples, duplas, curvas)
      .replace(/[\(\)\[\]\{\}]/g, ' ') // Remove parênteses e colchetes
      .replace(/\s+/g, ' ') // Normaliza espaços duplos
      .trim();

    const searchQuery = encodeURIComponent(cleanTitle);
    return `https://www.amazon.com.br/s?k=${searchQuery}&tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 3. Fallback de emergência caso não exista título
  return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;
}

export function getSanitizedAffiliateUrl(product: ProductUrlPayload, defaultTag = 'thomazpromos-20'): string {
  return getSanitizedProductUrl(product);
}
