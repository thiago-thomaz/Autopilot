import { NextResponse } from "next/server";
import { MetricsEngine } from "../../../../services/analytics/MetricsEngine";

export async function GET() {
  try {
    const channels = await MetricsEngine.getChannelPerformance();
    return NextResponse.json(channels);
  } catch (error) {
    console.error("[ANALYTICS_CHANNELS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch channels metrics" },
      { status: 500 }
    );
  }
}
