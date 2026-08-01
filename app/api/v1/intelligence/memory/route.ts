import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function GET() {
  const memories = aie.memorySystem.queryMemories({});
  return NextResponse.json({ success: true, data: memories });
}
