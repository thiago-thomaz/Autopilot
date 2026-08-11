import { NextResponse } from "next/server";
import { MetricsEngine } from "../../../../services/analytics/MetricsEngine";

export async function GET() {
  try {
    const marketplaces = await MetricsEngine.getMarketplacePerformance();
    return NextResponse.json(marketplaces);
  } catch (error) {
    console.error("[ANALYTICS_MARKETPLACES_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplaces metrics" },
      { status: 500 }
    );
  }
}
