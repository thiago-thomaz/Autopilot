import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');

  if (secret !== 'autopilot-cleanup-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sqlPath = path.join(process.cwd(), 'prisma', 'cleanup_mock_data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Remove comentários e divide em queries individuais
    const queries = sql
      .split(';')
      .map((q) => q.trim())
      .filter((q) => q.length > 0 && !q.startsWith('--') && !q.includes('SELECT'));

    const results = [];
    for (const query of queries) {
      if (query) {
        try {
          const res = await prisma.$executeRawUnsafe(query);
          results.push({ query, rowsAffected: res });
        } catch (e: any) {
          results.push({ query, error: e.message });
        }
      }
    }

    return NextResponse.json({
      message: 'Limpeza do banco executada com sucesso',
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Falha ao executar limpeza', details: error.message },
      { status: 500 }
    );
  }
}
