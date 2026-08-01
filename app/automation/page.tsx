'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ShieldAlert, CheckCircle2, AlertTriangle, Play, Pause, Settings, CheckSquare, History } from 'lucide-react';

export default function AutomationDashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/automation/overview');
      const json = await res.json();
      if (json.success) {
        setOverview(json.data);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleKillSwitch = async (activate: boolean) => {
    try {
      const endpoint = activate ? '/api/automation/kill-switch' : '/api/automation/resume';
      const res = await fetch(endpoint, { method: 'POST' });
      const json = await res.json();
      setActionMessage(json.message || 'Updated system status');
      fetchOverview();
    } catch (e: any) {
      setActionMessage('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-400 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex items-center gap-3">
          <Zap className="w-6 h-6 text-emerald-400 animate-bounce" />
          <span>Loading Decision Engine...</span>
        </div>
      </div>
    );
  }

  const isKillSwitchActive = overview?.health?.globalKillSwitch;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100">Autonomous Optimization & Decision Engine</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">MÓDULO 8 — Closed Loop Profit & Risk Decision System</p>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center gap-2">
          <Link
            href="/automation/approvals"
            className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <CheckSquare className="w-4 h-4" />
            Fila de Aprovação
          </Link>
          <Link
            href="/automation/history"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <History className="w-4 h-4" />
            Histórico & Performance
          </Link>
          <Link
            href="/automation/config"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-lg text-sm">
          {actionMessage}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Autonomy Level */}
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <div className="text-xs uppercase font-semibold text-gray-400">Nível de Autonomia</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">LEVEL_1_RECOMMEND</div>
          <div className="text-xs text-gray-500">Padrão Seguro (Requer aprovação prévia)</div>
        </div>

        {/* Health Score */}
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <div className="text-xs uppercase font-semibold text-gray-400">Health Score</div>
          <div className="text-2xl font-bold text-emerald-400">{overview?.health?.healthScore ?? 100}%</div>
          <div className="text-xs text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> API & DB Operacionais
          </div>
        </div>

        {/* Daily Spend vs Budget */}
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <div className="text-xs uppercase font-semibold text-gray-400">Gasto Diário de Automação</div>
          <div className="text-2xl font-bold text-gray-100">
            ${overview?.budget?.currentDailySpend ?? 0} / ${overview?.budget?.dailyBudget ?? 100}
          </div>
          <div className="text-xs text-gray-500">Limite de perda: ${overview?.budget?.dailyLossLimit ?? 50}/dia</div>
        </div>

        {/* Circuit Breaker & Kill Switch Status */}
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
          <div className="text-xs uppercase font-semibold text-gray-400">Status de Trava Global</div>
          <div className={`text-lg font-bold ${isKillSwitchActive ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isKillSwitchActive ? 'HALTED (Kill Switch ON)' : 'OPERATIONAL'}
          </div>
          <div className="pt-1">
            {isKillSwitchActive ? (
              <button
                onClick={() => toggleKillSwitch(false)}
                className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Retomar Automações
              </button>
            ) : (
              <button
                onClick={() => toggleKillSwitch(true)}
                className="w-full px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5" /> Ativar Kill Switch
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decision Flow Pipeline Card */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
        <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-400" /> Fluxo Fechado de Decisão (Closed Loop System)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg">
            <span className="font-bold text-emerald-400 block mb-1">1. Analytics</span>
            Sinais Módulo 7
          </div>
          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg">
            <span className="font-bold text-emerald-400 block mb-1">2. Decision Engine</span>
            Sugere Ações
          </div>
          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg">
            <span className="font-bold text-emerald-400 block mb-1">3. Policy & Risk</span>
            Valida Regras/Risco
          </div>
          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg">
            <span className="font-bold text-emerald-400 block mb-1">4. Budget Check</span>
            Estima Custos
          </div>
          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg">
            <span className="font-bold text-emerald-400 block mb-1">5. Approval Gate</span>
            Níveis de Autonomia
          </div>
          <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg">
            <span className="font-bold text-emerald-400 block mb-1">6. Action Executor</span>
            Adapta & Aprende
          </div>
        </div>
      </div>
    </div>
  );
}
