import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function GET() {
  const div = bos.portfolioEngine.analyzeDiversification({
    productShare: { 'Tech Gadgets': 45, 'Home Appliances': 30, 'Fashion': 25 },
    marketShare: { US: 55, BR: 30, DE: 15 },
    channelShare: { INSTAGRAM: 40, TIKTOK: 35, TELEGRAM: 25 },
    affiliateProgramShare: { Amazon: 60, MercadoLivre: 40 }
  });
  const rebalance = bos.rebalancingEngine.generateRebalancePlan(div);
  return NextResponse.json({ success: true, data: { diversification: div, rebalance } });
}
