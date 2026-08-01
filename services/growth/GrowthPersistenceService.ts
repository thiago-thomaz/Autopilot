import { PrismaClient } from '@prisma/client';

export class GrowthPersistenceService {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  public async getActiveCampaigns() {
    return this.prisma.campaign.findMany({
      where: { status: 'ACTIVE' },
      include: {
        objective: true,
        variants: true,
        experiments: true,
        health: true,
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  public async getCampaignById(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: {
        objective: true,
        variants: true,
        experiments: true,
        health: true,
        tasks: true
      }
    });
  }

  public async createCampaign(data: any) {
    return this.prisma.campaign.create({
      data
    });
  }

  public async updateCampaignStatus(id: string, status: any) {
    return this.prisma.campaign.update({
      where: { id },
      data: { status }
    });
  }

  public async getPendingGrowthTasks() {
    return this.prisma.growthTask.findMany({
      where: { status: 'PENDING' },
      orderBy: [{ priority: 'asc' }, { scheduledAt: 'asc' }]
    });
  }

  public async updateTaskStatus(id: string, status: any, error?: string) {
    return this.prisma.growthTask.update({
      where: { id },
      data: {
        status,
        error: error || null,
        completedAt: status === 'COMPLETED' ? new Date() : undefined
      }
    });
  }

  public async getGrowthObjectives() {
    return this.prisma.growthObjective.findMany({
      orderBy: { priority: 'asc' }
    });
  }

  public async createGrowthObjective(data: any) {
    return this.prisma.growthObjective.create({ data });
  }

  public async getCampaignHealth(campaignId: string) {
    return this.prisma.campaignHealth.findUnique({
      where: { campaignId }
    });
  }

  public async upsertCampaignHealth(campaignId: string, healthData: any) {
    return this.prisma.campaignHealth.upsert({
      where: { campaignId },
      create: { campaignId, ...healthData },
      update: healthData
    });
  }
}
