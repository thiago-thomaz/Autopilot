'use client';

import React from 'react';
import { Target, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';

export default function OpportunityRadarPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-cyan-400" />
          Radar de Oportunidades
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Identificação autônoma de oportunidades classificadas por Expected Net Profit, CVR, EPC e nível de risco.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Amazon Tech Gadgets US', domain: 'US_MARKET', expectedProfit: '$4,500.00', cvr: '4.50%', epc: '$18.50', score: '94.5' },
          { title: 'Mercado Livre Home BR', domain: 'BR_MARKET', expectedProfit: '$3,200.00', cvr: '5.20%', epc: '$14.20', score: '88.2' }
        ].map((opp, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">{opp.title}</h3>
              <span className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Score: {opp.score}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-gray-800">
              <div>
                <span className="text-gray-500 text-[10px] block">Lucro Esperado</span>
                <span className="text-emerald-400 font-bold">{opp.expectedProfit}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">CVR Preditivo</span>
                <span className="text-gray-200">{opp.cvr}</span>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">EPC Preditivo</span>
                <span className="text-gray-200">{opp.epc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
