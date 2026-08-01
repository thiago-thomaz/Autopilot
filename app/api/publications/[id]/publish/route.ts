import { NextRequest, NextResponse } from 'next/server';
import { PublicationWorker } from '@/services/publication/PublicationWorker';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const worker = new PublicationWorker(`manual_trigger_${params.id}`);
    const result = await worker.processPendingQueue(10);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
