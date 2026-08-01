import { prisma } from '../../lib/prisma';

export class ExperimentEngine {
  public static async createExperiment(name: string, hypothesis: string, entityId: string, variants: string[]) {
    return await prisma.experimentRecord.create({
      data: {
        name,
        hypothesis,
        entityType: 'PRODUCT',
        entityId,
        variants,
        status: 'RUNNING',
      },
    });
  }
}
