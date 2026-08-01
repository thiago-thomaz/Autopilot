'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, ArrowLeft, Save, Shield } from 'lucide-react';

export default function ConfigPage() {
  const [config, setConfig] = useState<any>({
    autonomyLevel: 'LEVEL_1_RECOMMEND',
    dailyBudget: 100,
    monthlyBudget: 3000,
    dailyLossLimit: 50,
    enableAutonomousDecisions: false,
    enableAutoLowRisk: false,
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/automation/config');
      const json = await res.json();
      if (json.success) {
        setConfig((prev: any) => ({ ...prev, ...json.data }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/automation/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      setMsg(json.message || 'Config saved');
    } catch (e) {
      setMsg('Failed to save config');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/automation" className="p-2 text-gray-400 hover:text-gray-200 bg-gray-900 border border-gray-800 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-400" /> Configurações & Limites do Engine
            </h1>
            <p className="text-sm text-gray-400">Ajuste os parâmetros de autonomia, orçamento e limites de perda de capital</p>
          </div>
        </div>
      </div>

      {msg && <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-lg text-sm">{msg}</div>}

      <form onSubmit={handleSave} className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-6">
        {/* Autonomy Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-200 block">Nível de Autonomia Ativo</label>
          <select
            value={config.autonomyLevel}
            onChange={(e) => setConfig({ ...config, autonomyLevel: e.target.value })}
            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-lg text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
          >
            <option value="LEVEL_0_OBSERVE">LEVEL_0_OBSERVE (Apenas observação e logging)</option>
            <option value="LEVEL_1_RECOMMEND">LEVEL_1_RECOMMEND (Padrão: Recomendações com aprovação manual)</option>
            <option value="LEVEL_2_AUTO_LOW_RISK">LEVEL_2_AUTO_LOW_RISK (Automação de baixo risco)</option>
            <option value="LEVEL_3_AUTO_MEDIUM_RISK">LEVEL_3_AUTO_MEDIUM_RISK (Automação de risco médio)</option>
            <option value="LEVEL_4_SUPERVISED_HIGH_IMPACT">LEVEL_4_SUPERVISED_HIGH_IMPACT (Supervisionado alto impacto)</option>
            <option value="LEVEL_5_FULL_AUTONOMY_ALLOWED_ACTIONS">LEVEL_5_FULL_AUTONOMY_ALLOWED_ACTIONS (Autonomia total restrita a ações permitidas)</option>
          </select>
        </div>

        {/* Budgets & Loss Limits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Orçamento Diário ($)</label>
            <input
              type="number"
              value={config.dailyBudget}
              onChange={(e) => setConfig({ ...config, dailyBudget: parseFloat(e.target.value) })}
              className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Orçamento Mensal ($)</label>
            <input
              type="number"
              value={config.monthlyBudget}
              onChange={(e) => setConfig({ ...config, monthlyBudget: parseFloat(e.target.value) })}
              className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Limite de Perda Diária ($)</label>
            <input
              type="number"
              value={config.dailyLossLimit}
              onChange={(e) => setConfig({ ...config, dailyLossLimit: parseFloat(e.target.value) })}
              className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-amber-400 font-bold"
            />
          </div>
        </div>

        {/* Feature Flags */}
        <div className="pt-4 border-t border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-gray-200">Feature Flags do Engine</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={config.enableAutonomousDecisions}
                onChange={(e) => setConfig({ ...config, enableAutonomousDecisions: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span>ENABLE_AUTONOMOUS_DECISIONS</span>
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={config.enableAutoLowRisk}
                onChange={(e) => setConfig({ ...config, enableAutoLowRisk: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span>ENABLE_AUTO_LOW_RISK</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Salvar Configurações
        </button>
      </form>
    </div>
  );
}
