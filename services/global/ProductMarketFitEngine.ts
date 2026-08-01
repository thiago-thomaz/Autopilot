export class ProductMarketFitEngine {
  public calculateFitScore(category: string, country: string): number {
    const code = country.toUpperCase();
    const cat = category.toUpperCase();

    let fitScore = 75; // baseline

    if (cat === 'ELECTRONICS' && (code === 'US' || code === 'DE' || code === 'JP')) fitScore += 15;
    if (cat === 'HEALTH_BEAUTY' && (code === 'BR' || code === 'US')) fitScore += 15;
    if (cat === 'SOFTWARE_SAAS' && (code === 'US' || code === 'DE' || code === 'UK')) fitScore += 20;

    return Math.min(100, fitScore);
  }
}
