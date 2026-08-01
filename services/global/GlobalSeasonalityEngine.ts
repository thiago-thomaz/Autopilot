export interface GlobalShoppingEvent {
  event: string;
  country: string;
  month: number;
  multiplier: number;
}

export class GlobalSeasonalityEngine {
  private events: GlobalShoppingEvent[] = [
    { event: 'Black Friday & Cyber Monday', country: 'US', month: 11, multiplier: 2.5 },
    { event: 'Prime Day', country: 'US', month: 7, multiplier: 2.0 },
    { event: 'Single\'s Day (11.11)', country: 'CN', month: 11, multiplier: 3.0 },
    { event: 'Carnival Promotion', country: 'BR', month: 2, multiplier: 1.8 },
    { event: 'Christmas Season', country: 'GLOBAL', month: 12, multiplier: 2.2 }
  ];

  public getActiveEvents(month: number, country: string): GlobalShoppingEvent[] {
    const code = country.toUpperCase();
    return this.events.filter(e => e.month === month && (e.country === code || e.country === 'GLOBAL'));
  }
}
