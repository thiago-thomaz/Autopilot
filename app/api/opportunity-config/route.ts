import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_OPPORTUNITY_CONFIG } from '@/services/opportunity/OpportunityScoringService';
import { OpportunityScoringConfigSchema } from '@/types/opportunity/opportunity.types';

export async function GET() {
  try {
    const config = await prisma.opportunityEngineConfig.findFirst({
      where: { enabled: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!config) {
      return NextResponse.json({ success: true, config: DEFAULT_OPPORTUNITY_CONFIG });
    }

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = OpportunityScoringConfigSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Configuração inválida. A soma dos pesos deve ser exatamente 1.0 (100%).', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.opportunityEngineConfig.create({
      data: {
        name: 'CustomConfig',
        algorithmVersion: body.algorithmVersion || 'v1.0.0',
        weights: body.weights,
        bonuses: body.bonuses,
        penalties: body.penalties,
        thresholds: body.thresholds,
        enabled: true,
      },
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
