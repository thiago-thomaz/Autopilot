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
  if (!product) return `${AFFILIATE_CONFIG.DEFAULT_DOMAIN}/?tag=${DEFAULT_AMAZON_TAG}`;

  // 1. Tenta usar a URL de afiliado completa retornada pelas APIs oficiais
  let rawUrl =
    product.affiliateUrl ||
    product.originalUrl ||
    product.affiliate_url ||
    product.original_url ||
    product.url;

  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
    let cleanUrl = rawUrl.trim();

    // Mapeamento de correção para ASINs obsoletos conhecidos na URL
    if (cleanUrl.includes('B092DC27PN')) {
      cleanUrl = cleanUrl.replace('B092DC27PN', 'B0B8K3ZSK6');
    } else if (cleanUrl.includes('B07NRR739V')) {
      cleanUrl = cleanUrl.replace('B07NRR739V', 'B07XQ8P6S1');
    } else if (cleanUrl.includes('B08FCMK8LN')) {
      cleanUrl = cleanUrl.replace('B08FCMK8LN', 'B075F38KMD');
    } else if (cleanUrl.includes('B073VTVS44')) {
      cleanUrl = cleanUrl.replace('B073VTVS44', 'B083321VT8');
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl.replace(/^\/+/, '')}`;
    }
    try {
      const parsed = new URL(cleanUrl);

      // Injeção de tag para Amazon
      if (parsed.hostname.includes('amazon.')) {
        parsed.searchParams.set('tag', DEFAULT_AMAZON_TAG);
        
        let cleanId = (product.externalId || product.asin || product.id || '').toString().trim();
        if (cleanId === 'B092DC27PN') cleanId = 'B0B8K3ZSK6';
        else if (cleanId === 'B07NRR739V') cleanId = 'B07XQ8P6S1';
        else if (cleanId === 'B08FCMK8LN') cleanId = 'B075F38KMD';
        else if (cleanId === 'B073VTVS44') cleanId = 'B083321VT8';

        const sanitizedId = cleanId.replace(/[^a-zA-Z0-9_-]/g, '');
        if (sanitizedId && (parsed.pathname.includes('/dp/') || parsed.pathname.includes('/gp/product/'))) {
          parsed.pathname = `/dp/${sanitizedId}`;
        }
        return parsed.toString();
      }

      // Injeção de tag para Mercado Livre
      if (parsed.hostname.includes('mercadolivre.') || parsed.hostname.includes('mercadolibre.')) {
        if (!parsed.searchParams.has('p') && !parsed.searchParams.has('matt_tool')) {
          parsed.searchParams.set('p', `ml_afiliado_${DEFAULT_AMAZON_TAG}`);
        }
        return parsed.toString();
      }

      return parsed.toString();
    } catch (e) {
      console.warn('URL fornecida inválida, recorrendo a fallback seguro:', cleanUrl);
    }
  }

  // 2. Se houver externalId/ASIN/ID válido, gera a URL de produto direta
  let cleanId = (product.externalId || product.asin || product.id || '').toString().trim();
  if (cleanId === 'B092DC27PN') cleanId = 'B0B8K3ZSK6';
  else if (cleanId === 'B07NRR739V') cleanId = 'B07XQ8P6S1';
  else if (cleanId === 'B08FCMK8LN') cleanId = 'B075F38KMD';
  else if (cleanId === 'B073VTVS44') cleanId = 'B083321VT8';

  const sanitizedId = cleanId.replace(/[^a-zA-Z0-9_-]/g, '');
  if (sanitizedId.length > 0) {
    const platformRaw = (product.platform || '').toString().toUpperCase().replace(/[-_]/g, '');

    // Se for especificamente Mercado Livre, Shopee, etc. e tiver ID, respeita
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

    // Default: gera URL direta da Amazon caso o ID tenha um formato de ASIN típico (geralmente >= 10 chars)
    if (sanitizedId.length >= 10) {
      return `https://www.amazon.com.br/dp/${sanitizedId}?tag=${DEFAULT_AMAZON_TAG}`;
    }
  }

  // 3. FALLBACK ANTI-404 DEFINITIVO: Busca por Título com Tag de Afiliado Preservada
  if (product.title) {
    const cleanQuery = encodeURIComponent(product.title.trim());
    return `https://www.amazon.com.br/s?k=${cleanQuery}&tag=${DEFAULT_AMAZON_TAG}`;
  }

  // 4. Fallback padrão da loja com tag
  return `https://www.amazon.com.br/?tag=${DEFAULT_AMAZON_TAG}`;
}

export function getSanitizedAffiliateUrl(product: ProductUrlPayload, defaultTag = 'thomazpromos-20'): string {
  return getSanitizedProductUrl(product);
}
