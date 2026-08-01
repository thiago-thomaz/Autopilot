export class TrafficQualityEngine {
  public static evaluateClickQuality(userAgent?: string): { qualityScore: number; isBot: boolean } {
    if (!userAgent) return { qualityScore: 50, isBot: false };
    const ua = userAgent.toLowerCase();
    const botKeywords = ['bot', 'crawler', 'spider', 'headless', 'python-requests'];
    const isBot = botKeywords.some((b) => ua.includes(b));

    return {
      qualityScore: isBot ? 0 : 100,
      isBot,
    };
  }
}
