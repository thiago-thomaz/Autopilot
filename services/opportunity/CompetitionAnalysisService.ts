export class CompetitionAnalysisService {
  /**
   * Avalia o nível de concorrência e ruído da oferta nas redes.
   */
  public static analyzeCompetition(category?: string): { competitionScore: number; noiseLevel: 'LOW' | 'MEDIUM' | 'HIGH' } {
    const highCompetitionCategories = ['eletrônicos', 'smartphones', 'informática'];
    const catLower = (category || '').toLowerCase();

    if (highCompetitionCategories.some((c) => catLower.includes(c))) {
      return { competitionScore: 60, noiseLevel: 'HIGH' };
    }

    return { competitionScore: 80, noiseLevel: 'MEDIUM' };
  }
}
