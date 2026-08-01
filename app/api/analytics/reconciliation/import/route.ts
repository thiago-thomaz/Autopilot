import { NextRequest, NextResponse } from 'next/server';
import { AffiliateReportImporter } from '@/services/analytics/AffiliateReportImporter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows = body.rows || [];

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Lista de registros de vendas está vazia.' }, { status: 400 });
    }

    const report = await AffiliateReportImporter.importReport(rows);
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
