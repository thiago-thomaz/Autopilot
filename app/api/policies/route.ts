import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const policies = [
      { country: 'US', regulation: 'FTC 16 CFR § 255', disclosureRequired: true, optInRequired: false },
      { country: 'UK', regulation: 'ASA CAP Code', disclosureRequired: true, optInRequired: true },
      { country: 'BR', regulation: 'CONAR & LGPD', disclosureRequired: true, optInRequired: true },
      { country: 'DE', regulation: 'UWG & GDPR', disclosureRequired: true, optInRequired: true }
    ];
    return NextResponse.json({ success: true, count: policies.length, data: policies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
