'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckSquare, ArrowLeft, Check, X, Clock, AlertTriangle } from 'lucide-react';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/automation/approvals');
      const json = await res.json();
      if (json.success) {
        setApprovals(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (decisionId: string, action: 'approve' | 'reject' | 'snooze') => {
    try {
      const res = await fetch(`/api/automation/decisions/${decisionId}/${action}`, { method: 'POST' });
      const json = await res.json();
      setMsg(json.message || `Decision ${action}d successfully`);
      fetchApprovals();
    } catch (e) {
      setMsg(`Failed to ${action} decision`);
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
              <CheckSquare className="w-6 h-6 text-emerald-400" /> Fila de Aprovação de Decisões
            </h1>
            <p className="text-sm text-gray-400">Decisões autônomas de risco médio/alto aguardando validação humana</p>
          </div>
        </div>
      </div>

      {msg && <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-lg text-sm">{msg}</div>}

      {loading ? (
        <div className="p-12 text-center text-gray-400">Carregando fila de aprovação...</div>
      ) : approvals.length === 0 ? (
        <div className="p-12 bg-gray-900 border border-gray-800 rounded-xl text-center text-gray-400 space-y-2">
          <Check className="w-8 h-8 text-emerald-400 mx-auto" />
          <div className="text-lg font-bold text-gray-200">Nenhuma decisão pendente</div>
          <p className="text-xs text-gray-500">Todas as otimizações estão aprovadas ou em execução automática.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((req) => {
            const d = req.decision;
            return (
              <div key={req.id} className="p-6 bg-gray-900 border border-gray-800 rounded-xl flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {d.decisionType}
                    </span>
                    <span className="text-xs text-gray-400">Escopo: {d.scope}</span>
                    <span className="text-xs text-gray-500">Prioridade: P{d.priority}</span>
                  </div>

                  <div className="text-sm font-semibold text-gray-200">{d.reason}</div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-gray-950 p-3 rounded-lg border border-gray-800">
                    <div>
                      <span className="text-gray-500 block">Risco Estimado</span>
                      <span className="font-bold text-amber-400">{d.riskScore}/100</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Confiança</span>
                      <span className="font-bold text-emerald-400">{(d.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Entidade</span>
                      <span className="font-mono text-gray-300">{d.entityType} ({d.entityId})</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Autonomia Exigida</span>
                      <span className="font-mono text-gray-300">{d.autonomyLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6">
                  <button
                    onClick={() => handleAction(d.id, 'approve')}
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Aprovar
                  </button>
                  <button
                    onClick={() => handleAction(d.id, 'reject')}
                    className="w-full px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Rejeitar
                  </button>
                  <button
                    onClick={() => handleAction(d.id, 'snooze')}
                    className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" /> Adiar (24h)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
