import { ContentPackage } from '@prisma/client';

export class ContentStrategyEngine {
  /**
   * Determina a data e hora ideais para publicação baseando-se no produto e categoria.
   */
  public static determineOptimalSchedule(product: any): Date {
    const now = new Date();
    
    // 1. Urgência Alta: Descontos maiores que 50%
    if (product.currentPrice && product.previousPrice) {
      const discount = ((product.previousPrice - product.currentPrice) / product.previousPrice) * 100;
      if (discount >= 50) {
        // Postar imediatamente
        return now;
      }
    }

    const category = (product.category || '').toLowerCase();
    
    // 2. Eletrônicos e Tech: Horários de almoço ou noite
    const isTech = category.includes('eletronico') || category.includes('celular') || category.includes('informatica') || category.includes('computador') || category.includes('smart');
    if (isTech) {
      return this.getNextAvailableTime(now, [
        { hour: 12, minute: 0 },
        { hour: 19, minute: 30 }
      ]);
    }

    // 3. Casa e Cozinha: Manhã e início da tarde
    const isHome = category.includes('casa') || category.includes('cozinha') || category.includes('eletrodomestico') || category.includes('moveis');
    if (isHome) {
      return this.getNextAvailableTime(now, [
        { hour: 8, minute: 30 },
        { hour: 14, minute: 0 }
      ]);
    }

    // 4. Fallback Geral (Horário de Pico Geral: 18h)
    return this.getNextAvailableTime(now, [
      { hour: 18, minute: 0 },
      { hour: 20, minute: 0 }
    ]);
  }

  private static getNextAvailableTime(now: Date, timeSlots: Array<{ hour: number, minute: number }>): Date {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let selectedSlot = timeSlots.find(slot => 
      slot.hour > currentHour || (slot.hour === currentHour && slot.minute > currentMinute)
    );

    const scheduledDate = new Date(now);

    if (selectedSlot) {
      scheduledDate.setHours(selectedSlot.hour, selectedSlot.minute, 0, 0);
    } else {
      // Já passou do último horário de hoje, agendar para o primeiro de amanhã
      scheduledDate.setDate(scheduledDate.getDate() + 1);
      scheduledDate.setHours(timeSlots[0].hour, timeSlots[0].minute, 0, 0);
    }

    // Add a random variance of up to 15 minutes to avoid exact same minute blasts
    const varianceMinutes = Math.floor(Math.random() * 15);
    scheduledDate.setMinutes(scheduledDate.getMinutes() + varianceMinutes);

    return scheduledDate;
  }
}
