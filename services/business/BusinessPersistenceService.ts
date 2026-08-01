import { PrismaClient } from '@prisma/client';

export class BusinessPersistenceService {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  public async getProfile() {
    return this.prisma.businessProfile.findFirst();
  }

  public async upsertProfile(data: any) {
    const existing = await this.prisma.businessProfile.findFirst();
    if (existing) {
      return this.prisma.businessProfile.update({
        where: { id: existing.id },
        data
      });
    }
    return this.prisma.businessProfile.create({ data });
  }

  public async getObjectives() {
    return this.prisma.businessObjective.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  public async createObjective(data: any) {
    return this.prisma.businessObjective.create({ data });
  }

  public async getLatestFinancials() {
    return this.prisma.businessFinancial.findFirst({
      orderBy: { date: 'desc' }
    });
  }

  public async recordFinancial(data: any) {
    return this.prisma.businessFinancial.create({ data });
  }

  public async getCashReserve() {
    return this.prisma.cashReserve.findFirst();
  }

  public async upsertCashReserve(data: any) {
    const existing = await this.prisma.cashReserve.findFirst();
    if (existing) {
      return this.prisma.cashReserve.update({
        where: { id: existing.id },
        data
      });
    }
    return this.prisma.cashReserve.create({ data });
  }

  public async getRisks() {
    return this.prisma.businessRisk.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { score: 'desc' }
    });
  }

  public async logDecision(data: any) {
    return this.prisma.businessDecisionLog.create({ data });
  }

  public async getPayouts() {
    return this.prisma.affiliatePayout.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}
