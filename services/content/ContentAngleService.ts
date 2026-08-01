import { ContentAngleType } from '@prisma/client';

export class ContentAngleService {
  /**
   * Seleciona o ângulo mais estratégico com base nos atributos do produto.
   */
  public static selectBestAngle(currentPrice: number, previousPrice?: number, category?: string): ContentAngleType {
    if (previousPrice && previousPrice > currentPrice * 1.15) {
      return 'DEAL'; // Oferta / Desconto atrativo
    }

    const catLower = (category || '').toLowerCase();
    if (catLower.includes('ferramentas') || catLower.includes('casa') || catLower.includes('eletrodomésticos')) {
      return 'PROBLEM_SOLUTION';
    }

    if (catLower.includes('informática') || catLower.includes('eletrônicos')) {
      return 'COMPARISON';
    }

    return 'REVIEW';
  }
}
