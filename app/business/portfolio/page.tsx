'use client';

import React from 'react';
import { PieChart, Grid, ShieldAlert, Sparkles } from 'lucide-react';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <PieChart className="w-6 h-6 text-emerald-400" />
          Painel de Portfólio & Matriz Global
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Matrizes Produto × Mercado, Canal × Mercado e detecção de lacunas de mercado e risco de concentração.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Diversification Score Card */}
        <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
          <div className="text-xs font-semibold text-gray-400">Score de Diversificação</div>
          <div className="text-4xl font-extrabold text-emerald-400">75.0 / 100</div>
          <div className="text-xs text-gray-400">Grau de diversificação saudável em 3 países e 4 canais.</div>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
          <div className="text-xs font-semibold text-gray-400">Maior Fator de Risco</div>
          <div className="text-xl font-bold text-amber-300 font-mono">MARKET_CONCENTRATION</div>
          <div className="text-xs text-gray-400">Mercado US representa 55% das vendas totais.</div>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
          <div className="text-xs font-semibold text-gray-400">Lacuna Estratégica (White Space)</div>
          <div className="text-xl font-bold text-cyan-300 font-mono">DE — Home Appliances</div>
          <div className="text-xs text-gray-400">Oportunidade de alta conversão sem concorrência ativa.</div>
        </div>
      </div>
    </div>
  );
}
