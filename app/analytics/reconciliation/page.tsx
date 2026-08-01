'use client';

import { useState } from 'react';
import { FileCheck, ArrowLeft, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReconciliationPage() {
  const [result, setResult] = useState<any>(null);
  const [importing, setImporting] = useState(false);

  const handleSimulateImport = async () => {
    setImporting(true);
    try {
      const sampleRows = [
        { orderId: 'ORD_9991', amount: 749.0, commission: 67.41 },
        { orderId: 'ORD_9992', amount: 1200.0, commission: 108.0 },
      ];

      const res = await fetch('/api/analytics/reconciliation/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: sampleRows }),
      });
      const json = await res.json();
      if (json.success) setResult(json.report);
    } catch (err) {
      console.error('Erro na importação:', err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <Link href="/analytics" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Analytics</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Conciliação de Relatórios de Afiliados</h1>
            <p className="text-xs text-gray-400">
              Importação de arquivos de vendas e conciliação financeira contra cliques internos.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateImport}
          disabled={importing}
          className="flex items-center gap-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{importing ? 'Processando...' : 'Importar Relatório DEMO'}</span>
        </button>
      </div>

      {result && (
        <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-6 space-y-4 text-xs shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Resultado da Conciliação Financeira</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
              <span className="text-gray-500 uppercase text-[10px] font-bold">Registros Importados</span>
              <div className="text-xl font-bold text-gray-200">{result.importedRecords}</div>
            </div>
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
              <span className="text-gray-500 uppercase text-[10px] font-bold">Vendas Reconciliadas</span>
              <div className="text-xl font-bold text-emerald-400">{result.matchedCount}</div>
            </div>
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
              <span className="text-gray-500 uppercase text-[10px] font-bold">Vendas Não Pareadas</span>
              <div className="text-xl font-bold text-amber-400">{result.missingCount}</div>
            </div>
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
              <span className="text-gray-500 uppercase text-[10px] font-bold">Taxa de Conciliação</span>
              <div className="text-xl font-bold text-indigo-400">{result.reconciliationRate}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
