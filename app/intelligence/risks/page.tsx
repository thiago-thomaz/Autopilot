'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RiskRadarPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          Radar de Riscos & Mitigações
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitoramento contínuo de riscos financeiros, operacionais, de compliance e de links de afiliados.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            category: 'CONCENTRATION_RISK',
            desc: 'Mercado US representa 55% da receita líquida acumulada.',
            severity: 'MEDIUM',
            action: 'Rebalancear 15% do orçamento para os mercados DE e BR.'
          },
          {
            category: 'LINK_HEALTH',
            desc: 'Tag de rastreio de afiliado indisponível temporariamente na plataforma de teste.',
            severity: 'HIGH',
            action: 'Redirecionar tráfego para rota de contingência via BusinessContinuityEngine.'
          }
        ].map((r, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {r.category}
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono text-[10px]">
                Severidade: {r.severity}
              </span>
            </div>
            <p className="text-gray-300">{r.desc}</p>
            <div className="p-3 rounded-lg bg-gray-950/80 border border-gray-800 text-gray-400">
              <strong className="text-emerald-400">Plano de Mitigação:</strong> {r.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
