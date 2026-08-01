import { ContentAngleType } from '@prisma/client';

export class HookEngine {
  /**
   * Gera hooks éticos e diretos por tipo de ângulo.
   */
  public static generateHook(title: string, currentPrice: number, angle: ContentAngleType): string {
    switch (angle) {
      case 'DEAL':
        return `Oportunidade em oferta: ${title} por R$ ${currentPrice.toFixed(2)}!`;
      case 'PROBLEM_SOLUTION':
        return `Buscando praticidade no dia a dia? Conheça o ${title}.`;
      case 'COMPARISON':
        return `Vale a pena adquirir o ${title}? Veja os pontos principais:`;
      default:
        return `Confira todos os detalhes e a análise sobre o ${title}:`;
    }
  }
}
