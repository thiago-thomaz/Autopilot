export class OpportunityExpirationService {
  private static TTL_HOURS = 24;

  /**
   * Verifica se o snapshot de oportunidade expirou (mais de 24 horas de idade).
   */
  public static isSnapshotExpired(snapshotCreatedAt: Date): boolean {
    const ageInHours = (Date.now() - new Date(snapshotCreatedAt).getTime()) / (1000 * 60 * 60);
    return ageInHours > this.TTL_HOURS;
  }
}
