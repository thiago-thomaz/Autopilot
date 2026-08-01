'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, PieChart, Layers, ArrowUpRight } from 'lucide-react';

export default function FinancialPanelPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          Painel FinanceiroExecutivo & DRE
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Demonstrativo do Resultado do Exercício (DRE), Fluxo de Caixa (DFC), Centro de Custos de IA e Rastreamento de Saques de Afiliados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DRE Detailed Table */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            DRE — Demonstração de Resultado em Tempo Real
          </h2>
          <div className="space-y-2 text-xs">
            {[
              { category: '(+) Receita Bruta de Comissões', amount: '$28,500.00', pct: '100.0%' },
              { category: '(-) Reembolsos', amount: '-$300.00', pct: '-1.05%' },
              { category: '(-) Estornos de Afiliados', amount: '-$100.00', pct: '-0.35%' },
              { category: '(=) Receita Líquida Real', amount: '$28,100.00', pct: '98.60%' },
              { category: '(-) Centro de Custo: IA (OpenAI / Gemini)', amount: '-$450.00', pct: '-1.58%' },
              { category: '(-) Centro de Custo: Infraestrutura & Servidores', amount: '-$750.00', pct: '-2.63%' },
              { category: '(=) Lucro Líquido Real (Net Profit)', amount: '$26,900.00', pct: '94.38%' }
            ].map((row, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-gray-950/60 border border-gray-800 flex items-center justify-between font-mono">
                <span className="text-gray-300 font-medium">{row.category}</span>
                <div className="space-x-4">
                  <span className="text-emerald-400 font-bold">{row.amount}</span>
                  <span className="text-gray-500 text-[10px]">{row.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate Payout Tracker & Cash Flow */}
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Rastreamento de Saques & Comissões de Afiliados
            </h2>
            <div className="space-y-3">
              {[
                { program: 'Amazon Associates (US)', expected: '$12,400.00', paid: '$12,400.00', status: 'PAID' },
                { program: 'Mercado Livre (BR)', expected: '$8,500.00', paid: '$8,500.00', status: 'PAID' },
                { program: 'ClickBank (DE)', expected: '$4,500.00', paid: '$0.00', status: 'PENDING' }
              ].map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-200">{p.program}</div>
                    <div className="text-[10px] text-gray-400">Esperado: {p.expected}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
