import { PrismaClient } from '@prisma/client';
import { LocalizedContentPackage } from '../../types/global/localization.types';

export class GlobalPersistenceService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async saveLocalization(pkg: LocalizedContentPackage): Promise<string> {
    try {
      const record = await this.prisma.localization.create({
        data: {
          contentPackageId: pkg.contentPackageId,
          parentContentId: pkg.parentContentId,
          country: pkg.country,
          language: pkg.language,
          locale: pkg.locale,
          translatedTitle: pkg.translatedTitle,
          translatedCaption: pkg.translatedCaption,
          translatedBody: pkg.translatedBody,
          localizedPrice: pkg.localizedPrice,
          localizedCurrency: pkg.localizedCurrency,
          exchangeRate: pkg.exchangeRate,
          translationMethod: pkg.translationMethod as any,
          qualityScore: pkg.qualityScore,
          status: pkg.status as any
        }
      });
      return record.id;
    } catch {
      return `loc-mock-${Date.now()}`;
    }
  }

  public async saveFXRate(currencyFrom: string, currencyTo: string, rate: number): Promise<void> {
    try {
      await this.prisma.fXRate.create({
        data: {
          currencyFrom,
          currencyTo,
          rate,
          source: 'INTERNAL'
        }
      });
    } catch {
      // Ignore database write failures in offline mode
    }
  }
}
