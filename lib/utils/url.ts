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
}

// Configuração centralizada de Tags e IDs de Afiliado por Marketplace
export const AFFILIATE_CONFIG = {
  AMAZON: {
    tag: process.env.NEXT_PUBLIC_AMAZON_PARTNER_TAG || 'thomazpromos-20',
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
 * Sanitiza e garante a integridade da URL de origem/afiliado para qualquer marketplace.
 */
export function getSanitizedProductUrl(product: ProductUrlPayload): string {
  if (!product) return AFFILIATE_CONFIG.DEFAULT_DOMAIN;

  // Mapeamento de correção para ASINs conhecidos
  let cleanId = (product.externalId || product.asin || product.id || '').toString().trim();
  if (cleanId === 'B092DC27PN') {
    cleanId = 'B0B8K3ZSK6'; // ASIN ativo no catálogo da Amazon BR para LG UltraGear 24"
  } else if (cleanId === 'B07NRR739V') {
    cleanId = 'B07XQ8P6S1'; // ASIN ativo para Café Orfeu 250g
  } else if (cleanId === 'B08FCMK8LN') {
    cleanId = 'B075F38KMD'; // ASIN ativo para Azeite Andorinha 500ml
  }

  // 1. Tenta extrair qualquer URL direta informada no payload
  let rawUrl =
    product.affiliateUrl ||
    product.originalUrl ||
    product.affiliate_url ||
    product.original_url ||
    product.url;

  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim() !== '') {
    let cleanUrl = rawUrl.trim();

    // Substitui ASINs obsoletos conhecidos na URL
    if (cleanUrl.includes('B092DC27PN')) {
      cleanUrl = cleanUrl.replace('B092DC27PN', 'B0B8K3ZSK6');
    } else if (cleanUrl.includes('B07NRR739V')) {
      cleanUrl = cleanUrl.replace('B07NRR739V', 'B07XQ8P6S1');
    } else if (cleanUrl.includes('B08FCMK8LN')) {
      cleanUrl = cleanUrl.replace('B08FCMK8LN', 'B075F38KMD');
    }

    // Garante obrigatoriamente o protocolo https://
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl.replace(/^\/+/, '')}`;
    }

    // Valida se a URL é sintaticamente correta e injeta tags do marketplace
    try {
      const parsed = new URL(cleanUrl);

      // Injeção de tag para Amazon
      if (parsed.hostname.includes('amazon.')) {
        parsed.searchParams.set('tag', AFFILIATE_CONFIG.AMAZON.tag);
        if (cleanId && (parsed.pathname.includes('/dp/') || parsed.pathname.includes('/gp/product/'))) {
          parsed.pathname = `/dp/${cleanId}`;
        }
        return parsed.toString();
      }

      // Injeção de tag para Mercado Livre
      if (parsed.hostname.includes('mercadolivre.') || parsed.hostname.includes('mercadolibre.')) {
        if (!parsed.searchParams.has('p') && !parsed.searchParams.has('matt_tool')) {
          parsed.searchParams.set('p', `ml_afiliado_${AFFILIATE_CONFIG.AMAZON.tag}`);
        }
        return parsed.toString();
      }

      return parsed.toString();
    } catch (e) {
      console.warn('URL de produto inválida no payload. Tentando fallback por ID externo:', cleanUrl);
    }
  }

  // 2. Fallback Inteligente por Marketplace usando externalId
  if (cleanId) {
    const sanitizedId = cleanId.replace(/[^a-zA-Z0-9_-]/g, '');

    if (sanitizedId.length > 0) {
      const platformRaw = (product.platform || '').toString().toUpperCase().replace(/[-_]/g, '');

      if (platformRaw.includes('MERCADO') || platformRaw.includes('MELI')) {
        return AFFILIATE_CONFIG.MERCADO_LIVRE.buildFallback(sanitizedId);
      }
      if (platformRaw.includes('SHOPEE')) {
        return AFFILIATE_CONFIG.SHOPEE.buildFallback(sanitizedId);
      }
      if (platformRaw.includes('ALIEXPRESS')) {
        return AFFILIATE_CONFIG.ALIEXPRESS.buildFallback(sanitizedId);
      }
      if (platformRaw.includes('MAGALU') || platformRaw.includes('MAGAZINE')) {
        return AFFILIATE_CONFIG.MAGALU.buildFallback(sanitizedId);
      }

      // Fallback padrão Amazon
      return AFFILIATE_CONFIG.AMAZON.buildFallback(sanitizedId);
    }
  }

  // 3. Fallback de segurança final
  return AFFILIATE_CONFIG.DEFAULT_DOMAIN;
}

export function getSanitizedAffiliateUrl(product: ProductUrlPayload, defaultTag = 'thomazpromos-20'): string {
  return getSanitizedProductUrl(product);
}
