export class SpamRiskService {
  /**
   * Avalia o risco de marcação como SPAM com base em hashtags excessivas ou palavras gatilho.
   */
  public static evaluateSpamRisk(caption: string, hashtags: string[]): { spamScore: number; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' } {
    let spamScore = 0;

    if (hashtags.length > 10) spamScore += 30;
    if (caption.includes('BUY NOW') || caption.includes('CLICK HERE NOW')) spamScore += 25;
    if ((caption.match(/!/g) || []).length > 5) spamScore += 20;

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (spamScore >= 50) riskLevel = 'HIGH';
    else if (spamScore >= 25) riskLevel = 'MEDIUM';

    return { spamScore, riskLevel };
  }
}
