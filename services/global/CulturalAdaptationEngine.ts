export interface CulturalAdaptationResult {
  adaptedBody: string;
  adaptedAngle: string;
  culturalNotes: string[];
}

export class CulturalAdaptationEngine {
  public adaptContentToCulture(body: string, country: string): CulturalAdaptationResult {
    const code = country.toUpperCase();
    let adaptedBody = body;
    const culturalNotes: string[] = [];
    let adaptedAngle = 'DEAL';

    if (code === 'DE') {
      // Germany: High emphasis on technical specifications and quality certificates
      adaptedAngle = 'SPECIFICATIONS_TRUST';
      culturalNotes.push('Emphasized DIN/TÜV specifications and warranty guarantees');
      adaptedBody = `${body}\n\n[Garantierte Qualität & Offizielle Garantie]`;
    } else if (code === 'BR') {
      // Brazil: High social proof and installment payment options
      adaptedAngle = 'INSTALMENTS_COMMUNITY';
      culturalNotes.push('Added parcelamento/sem juros emphasis');
      adaptedBody = `${body}\n\nParcele sem juros e confira as avaliações da comunidade!`;
    } else if (code === 'US') {
      // USA: Fast free shipping & hassle-free returns
      adaptedAngle = 'FREE_SHIPPING_CONVENIENCE';
      culturalNotes.push('Emphasized Prime 2-Day free shipping');
      adaptedBody = `${body}\n\nFast Free Shipping & Easy Returns!`;
    }

    return {
      adaptedBody,
      adaptedAngle,
      culturalNotes
    };
  }
}
