export class GenerationCostTracker {
  /**
   * Rastreia e estima o custo financeiro por requisição LLM.
   */
  public static estimateCost(provider: string, tokensUsed = 150): number {
    if (provider === 'MockLLM') return 0;
    // Estima ~R$ 0.001 por 1000 tokens em modelos otimizados (ex: gpt-4o-mini / gemini-flash)
    return Number(((tokensUsed / 1000) * 0.0015).toFixed(4));
  }
}
