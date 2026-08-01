import { NextResponse } from 'next/server';
import { FXService } from '../../../services/global/FXService';

const fxService = new FXService();

export async function GET() {
  try {
    const usdTobrl = fxService.convertCurrency(1.0, 'USD', 'BRL');
    const usdToeur = fxService.convertCurrency(1.0, 'USD', 'EUR');
    const usdTogbp = fxService.convertCurrency(1.0, 'USD', 'GBP');

    return NextResponse.json({
      success: true,
      data: [usdTobrl, usdToeur, usdTogbp]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
