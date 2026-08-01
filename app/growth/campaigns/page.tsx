'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Megaphone, Plus, Filter, Play, Pause, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CampaignManagerPage() {
  const [filterStrategy, setFilterStrategy] = useState('ALL');

  const campaigns = [
    { id: 'cmp_1', name: 'Harvest Tech BR', strategy: 'HARVEST', market: 'BR', channel: 'INSTAGRAM', budget: 12500, profit: 21400, roi: 171, status: 'RUNNING', health: 'HEALTHY' },
    { id: 'cmp_2', name: 'Expansion US Home', strategy: 'EXPANSION', market: 'US', channel: 'TIKTOK', budget: 8200, profit: 14100, roi: 172, status: 'SCALING', health: 'HEALTHY' },
    { id: 'cmp_3', name: 'Exploration Fashion DE', strategy: 'EXPLORATION', market: 'DE', channel: 'PINTEREST', budget: 3500, profit: 4250, roi: 121, status: 'OPTIMIZING', health: 'WATCH' },
    { id: 'cmp_4', name: 'Defense Brand BR', strategy: 'DEFENSE', market: 'BR', channel: 'TELEGRAM', budget: 2000, profit: 3100, roi: 155, status: 'RUNNING', health: 'HEALTHY' }
  ];

  const filtered = filterStrategy === 'ALL'
    ? campaigns
    : campaigns.filter((c) => c.strategy === filterStrategy);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-emerald-400" />
            Gerenciador de Campanhas Autônomas
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Orquestração detalhada de campanhas por estratégia, alocação de orçamento, saúde e histórico de otimização.
          </p>
        </div>
        <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow">
          <Plus className="w-4 h-4" />
          Nova Campanha
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filtrar Estratégia:
        </span>
        {['ALL', 'HARVEST', 'EXPANSION', 'EXPLORATION', 'DEFENSE'].map((strat) => (
          <button
            key={strat}
            onClick={() => setFilterStrategy(strat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStrategy === strat
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            {strat}
          </button>
        ))}
      </div>

      {/* Campaign List Table */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-950/80 text-gray-400 font-semibold border-b border-gray-800 uppercase tracking-wider">
            <tr>
              <th className="p-4">Campanha</th>
              <th className="p-4">Estratégia</th>
              <th className="p-4">Mercado / Canal</th>
              <th className="p-4">Orçamento</th>
              <th className="p-4">Lucro Líquido</th>
              <th className="p-4">ROI</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-800/40 transition">
                <td className="p-4 font-bold text-gray-200">{c.name}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {c.strategy}
                  </span>
                </td>
                <td className="p-4 text-gray-300 font-mono">{c.market} • {c.channel}</td>
                <td className="p-4 text-gray-200 font-semibold">${c.budget.toLocaleString()}</td>
                <td className="p-4 text-emerald-400 font-extrabold">${c.profit.toLocaleString()}</td>
                <td className="p-4 font-bold text-white">{c.roi}%</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="px-2.5 py-1 text-[10px] font-bold rounded bg-gray-800 hover:bg-gray-700 text-gray-200">
                    Pausar
                  </button>
                  <button className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-600/80 hover:bg-emerald-500 text-white">
                    Escalonar (+10%)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
