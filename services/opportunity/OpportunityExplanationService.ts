import { OpportunityRawFactors } from '../../types/opportunity/opportunity.factors';
import { OpportunityExplanation } from '../../types/opportunity/opportunity.types';

export class OpportunityExplanationService {
  /**
   * Gera uma síntese explicativa clara (pontos positivos, negativos e avisos) sobre o score do produto.
   */
  public static generateExplanation(
    factors: OpportunityRawFactors,
    bonuses: { name: string; points: number }[],
    penalties: { name: string; points: number }[]
  ): OpportunityExplanation {
    const positives: string[] = [];
    const negatives: string[] = [];
    const warnings: string[] = [];

    // Fatores de Preço e Desconto
    if (factors.price.discountPercent >= 20 && !factors.price.isSuspiciousDiscount) {
      positives.push(`Desconto atrativo de ${factors.price.discountPercent.toFixed(1)}% em relação ao preço anterior.`);
    }

    if (factors.priceHistory.isNearHistoricalMin) {
      positives.push('O preço atual está próximo da menor marca registrada no histórico.');
    }

    if (factors.price.isSuspiciousDiscount) {
      warnings.push('Desconto superior a 85% identificado; verificar se o preço de lista não foi artificialmente elevado.');
    }

    // Avaliações
    if (factors.rating.rating >= 4.5) {
      positives.push(`Excelente reputação dos compradores (nota ${factors.rating.rating.toFixed(1)}/5).`);
    } else if (factors.rating.rating > 0 && factors.rating.rating < 3.8) {
      negatives.push(`Avaliação média dos clientes está abaixo de 3.8 (${factors.rating.rating.toFixed(1)}/5).`);
    }

    // Comissão
    if (factors.commission.estimatedCommission >= 30) {
      positives.push(`Retorno financeiro estimado excelente (R$ ${factors.commission.estimatedCommission.toFixed(2)} por conversão).`);
    } else if (factors.commission.estimatedCommission < 5) {
      negatives.push(`Comissão por venda muito baixa (estimada em R$ ${factors.commission.estimatedCommission.toFixed(2)}).`);
    }

    // Estoque
    if (factors.availability.status === 'OUT_OF_STOCK') {
      negatives.push('Produto indisponível ou fora de estoque.');
      warnings.push('Não recomendado publicar campanhas ativas até a recomposição do estoque.');
    }

    // Histórico
    if (factors.priceHistory.historyQuality === 'INSUFFICIENT_HISTORY') {
      warnings.push('Poucos registros no histórico de preços para validar a estabilidade do valor.');
    }

    // Bônus e penalidades
    bonuses.forEach((b) => positives.push(`[Bônus] ${b.name} (+${b.points} pts)`));
    penalties.forEach((p) => negatives.push(`[Penalidade] ${p.name} (${p.points} pts)`));

    return {
      positives,
      negatives,
      warnings,
    };
  }
}
