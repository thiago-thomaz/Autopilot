/**
 * Utilitário Centralizado para Tratamento, Sanitize e Validação de URLs de Afiliados.
 * Garantia Anti-404 para Amazon Brasil, Mercado Livre e outros marketplaces.
 */

export function getSanitizedAffiliateUrl(product: any, defaultTag = 'thomazpromos-20'): string {
  if (!product) return '#';

  // 1. Obter a URL bruta disponível nos campos do payload (url, original_url, affiliate_url, originalUrl, affiliateUrl)
  let rawUrl =
    product.original_url ||
    product.affiliate_url ||
    product.originalUrl ||
    product.affiliateUrl ||
    product.url ||
    '';

  let cleanAsin = (product.externalId || product.asin || product.id || '').toString().trim();

  // Mapeamento de correção para ASINs legados/desatualizados comuns
  if (cleanAsin === 'B092DC27PN') {
    cleanAsin = 'B0B8K3ZSK6'; // ASIN ativo no catálogo da Amazon BR para LG UltraGear 24"
  } else if (cleanAsin === 'B07NRR739V') {
    cleanAsin = 'B07XQ8P6S1'; // ASIN ativo para Café Orfeu 250g
  } else if (cleanAsin === 'B08FCMK8LN') {
    cleanAsin = 'B075F38KMD'; // ASIN ativo para Azeite Andorinha 500ml
  }

  // 2. Se a URL estiver vazia, nula ou corrompida, realizar fallback de construção via ASIN/ID Externo
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    if (cleanAsin) {
      rawUrl = `https://www.amazon.com.br/dp/${cleanAsin}`;
    } else {
      return '#';
    }
  }

  let finalUrl = rawUrl.trim();

  // Se a URL contiver ASIN antigo conhecido, substitui pelo ASIN ativo
  if (finalUrl.includes('B092DC27PN')) {
    finalUrl = finalUrl.replace('B092DC27PN', 'B0B8K3ZSK6');
  } else if (finalUrl.includes('B07NRR739V')) {
    finalUrl = finalUrl.replace('B07NRR739V', 'B07XQ8P6S1');
  } else if (finalUrl.includes('B08FCMK8LN')) {
    finalUrl = finalUrl.replace('B08FCMK8LN', 'B075F38KMD');
  }

  // 3. Validação e Normalização de Protocolo (Garante https://)
  if (!/^https?:\/\//i.test(finalUrl)) {
    if (finalUrl.startsWith('//')) {
      finalUrl = `https:${finalUrl}`;
    } else {
      finalUrl = `https://${finalUrl}`;
    }
  }

  // 4. Injeção / Garantia da Tag de Afiliado por Marketplace
  try {
    const urlObj = new URL(finalUrl);

    // Tratamento especialista para Amazon Brasil
    if (urlObj.hostname.includes('amazon.')) {
      urlObj.searchParams.set('tag', defaultTag);

      // Garante estrutura /dp/{cleanAsin} se houver um ASIN ativo conhecido
      if (cleanAsin && (urlObj.pathname.includes('/dp/') || urlObj.pathname.includes('/gp/product/'))) {
        urlObj.pathname = `/dp/${cleanAsin}`;
      }

      return urlObj.toString();
    }

    // Tratamento especialista para Mercado Livre
    if (urlObj.hostname.includes('mercadolivre.') || urlObj.hostname.includes('mercadolibre.')) {
      if (!urlObj.searchParams.has('p') && !urlObj.searchParams.has('matt_tool')) {
        urlObj.searchParams.set('p', `ml_afiliado_${defaultTag}`);
      }
      return urlObj.toString();
    }

    return urlObj.toString();
  } catch {
    // Se o parse da URL falhar por formato atípico, força garantia do protocolo https e tag
    if (finalUrl.includes('amazon.com.br') && !finalUrl.includes('tag=')) {
      const sep = finalUrl.includes('?') ? '&' : '?';
      return `${finalUrl}${sep}tag=${defaultTag}`;
    }
    return finalUrl;
  }
}
