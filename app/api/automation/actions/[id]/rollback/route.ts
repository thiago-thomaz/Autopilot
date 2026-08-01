import { NextResponse } from 'next/server';
import { RollbackEngine } from '../../../../../../services/automation/RollbackEngine';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const actionId = params.id;
    const rollbackEngine = new RollbackEngine();

    const result = await rollbackEngine.executeRollback(actionId, 'Manual user rollback request');
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
