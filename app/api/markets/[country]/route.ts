import { NextResponse } from 'next/server';
import { MarketDiscoveryEngine, MarketRiskEngine, ChannelMarketFitEngine } from '../../../../services/global';

const discoveryEngine = new MarketDiscoveryEngine();
const riskEngine = new MarketRiskEngine();
const channelEngine = new ChannelMarketFitEngine();

export async function GET(request: Request, { params }: { params: { country: string } }) {
  try {
    const { country } = params;
    const market = discoveryEngine.getMarket(country);
    if (!market) {
      return NextResponse.json({ success: false, error: `Market not found for ${country}` }, { status: 404 });
    }

    const risk = riskEngine.evaluateMarketRisk(country);
    const topChannels = channelEngine.getTopChannelsForCountry(country);

    return NextResponse.json({
      success: true,
      data: {
        ...market,
        risk,
        topChannels,
        cvrBenchmark: 0.035,
        epcBenchmarkUSD: 1.25
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
