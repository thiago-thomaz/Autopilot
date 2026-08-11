export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { MetricsEngine } from "../../../../services/analytics/MetricsEngine";

export async function GET() {
  try {
    const overview = await MetricsEngine.getOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error("[ANALYTICS_OVERVIEW_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch overview metrics" },
      { status: 500 }
    );
  }
}
