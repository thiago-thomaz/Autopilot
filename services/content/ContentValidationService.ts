import { VerifiedFact, ClaimValidationResult } from '../../types/content/content.types';

export class ContentValidationService {
  /**
   * Converte uma string capturada como preço em número float válido.
   */
  private static parsePrice(str: string): number {
    let clean = str.trim();
    if (clean.includes(',') && clean.includes('.')) {
      // Ex: 1.499,90 -> 1499.90
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else if (clean.includes(',')) {
      // Ex: 749,00 -> 749.00
      clean = clean.replace(',', '.');
    }
    return parseFloat(clean);
  }

  /**
   * Audita o conteúdo gerado contra os fatos verificados do produto.
   * Identifica alterações de preços, depoimentos falsos ou características técnicas inventadas.
   */
  public static validateClaims(generatedText: string, verifiedFacts: VerifiedFact[]): ClaimValidationResult {
    const unsupportedClaims: string[] = [];
    const warnings: string[] = [];

    // Extrair todos os valores numéricos monetários válidos dos fatos
    const validPrices: number[] = [];
    verifiedFacts.forEach((f) => {
      if (typeof f.value === 'number') {
        validPrices.push(f.value);
      } else if (typeof f.value === 'string') {
        const parsed = this.parsePrice(f.value);
        if (!isNaN(parsed)) validPrices.push(parsed);
      }
    });

    // Verificar se o texto gerado menciona um preço desconhecido que destoa totalmente dos fatos
    const priceRegex = /R\$\s?(\d+[\.,]?\d*)/g;
    let match;
    while ((match = priceRegex.exec(generatedText)) !== null) {
      const foundPrice = this.parsePrice(match[1]);
      if (validPrices.length > 0) {
        const isMatch = validPrices.some((vp) => Math.abs(vp - foundPrice) < 1.0);
        if (!isMatch) {
          unsupportedClaims.push(
            `Valor numérico/preço não verificado detectado no texto: R$ ${foundPrice.toFixed(2)}.`
          );
        }
      }
    }

    // Verificar palavras de falsa promessa
    const forbiddenWords = ['garantido', 'lucro fácil', 'fique rico', 'milagroso'];
    const textLower = generatedText.toLowerCase();
    for (const word of forbiddenWords) {
      if (textLower.includes(word)) {
        unsupportedClaims.push(`Uso de promessa proibida ou enganosa: "${word}".`);
      }
    }

    return {
      valid: unsupportedClaims.length === 0,
      unsupportedClaims,
      warnings,
    };
  }
}
