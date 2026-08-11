import { NextResponse } from "next/server";
import { CommissionIntelligence } from "../../../../services/intelligence/CommissionIntelligence";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const ranking = await CommissionIntelligence.getProductRankingByEPC(limit) as any[];
    
    // As prisma.$queryRaw returns BigInts sometimes from COUNT/SUM, we need to convert them to string or number to be JSON serializable
    const serializedRanking = ranking.map((row: any) => {
      const serializedRow: any = {};
      for (const [key, value] of Object.entries(row)) {
        if (typeof value === 'bigint') {
          serializedRow[key] = Number(value);
        } else {
          serializedRow[key] = value;
        }
      }
      return serializedRow;
    });

    return NextResponse.json(serializedRanking);
  } catch (error) {
    console.error("[ANALYTICS_RANKING_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch EPC ranking" },
      { status: 500 }
    );
  }
}
