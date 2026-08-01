import { NextRequest, NextResponse } from 'next/server';
import { DiscoveryQueryService } from '@/services/discovery/DiscoveryQueryService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const query = await DiscoveryQueryService.getQueryById(params.id);
    return NextResponse.json({ success: true, query });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const query = await DiscoveryQueryService.updateQuery(params.id, body);
    return NextResponse.json({ success: true, query });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await DiscoveryQueryService.deleteQuery(params.id);
    return NextResponse.json({ success: true, message: 'Consulta salva excluída.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}
