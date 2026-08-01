'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, ArrowLeft, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

export default function HistoryPage() {
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/automation/decisions');
      const json = await res.json();
      if (json.success) {
        setDecisions(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const triggerRollback = async (actionId: string) => {
    try {
      const res = await fetch(`/api/automation/actions/${actionId}/rollback`, { method: 'POST' });
      const json = await res.json();
      setMsg(json.message || 'Rollback triggered successfully');
      fetchHistory();
    } catch (e) {
      setMsg('Rollback failed');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/automation" className="p-2 text-gray-400 hover:text-gray-200 bg-gray-900 border border-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
              <History className="w-6 h-6 text-emerald-400" /> Histórico & Desempenho de Decisões
            </h1>
            <p className="text-sm text-gray-400">Log imutável de decisões autônomas, ações executadas e resultados de ROI</p>
          </div>
        </div>
      </div>

      {msg && <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-lg text-sm">{msg}</div>}

      {loading ? (
        <div className="p-12 text-center text-gray-400">Carregando histórico...</div>
      ) : decisions.length === 0 ? (
        <div className="p-12 bg-gray-900 border border-gray-800 rounded-xl text-center text-gray-400">
          Nenhuma decisão registrada no histórico.
        </div>
      ) : (
        <div className="space-y-4">
          {decisions.map((d) => (
            <div key={d.id} className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {d.decisionType}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleString('pt-BR')}</span>
                  <span className="text-xs font-mono bg-gray-950 px-2 py-0.5 rounded text-gray-300 border border-gray-800">
                    {d.status}
                  </span>
                </div>

                {d.actions?.[0] && (
                  <button
                    onClick={() => triggerRollback(d.actions[0].id)}
                    className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Rollback Manual
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-200">{d.reason}</p>

              <div className="flex items-center gap-6 text-xs text-gray-400 pt-2 border-t border-gray-800">
                <div>Escopo: <span className="text-gray-200">{d.scope}</span></div>
                <div>Risk Score: <span className="text-amber-400 font-bold">{d.riskScore}/100</span></div>
                <div>Confiança: <span className="text-emerald-400 font-bold">{(d.confidence * 100).toFixed(0)}%</span></div>
                <div>Ações: <span className="text-gray-200">{d.actions?.length ?? 0}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
