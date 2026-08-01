'use client';

import React from 'react';
import { Zap, BookOpen, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DecisionCenterPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-400" />
          Centro de Decisões & Diário Auditável ("WHY")
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Registro formal de todas as decisões formuladas, justificativas causais, alternativas descartadas e fluxo de aprovação.
        </p>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Diário de Decisões Auditáveis (Journal)
        </h2>

        <div className="space-y-4 text-xs">
          {[
            {
              id: 'dec_001',
              title: 'Escalar Orçamento da Campanha US Tech em 25%',
              why: 'Modelos preditivos M9 indicam EPC estável de $18.50. O desvio entre os 10 agentes é 0.05 (consensual) e a trava de reserva de caixa está NORMAL.',
              level: 'LEVEL_1_OPERATIONAL',
              action: 'SCALE',
              status: 'APPROVED',
              confidence: '92%'
            },
            {
              id: 'dec_002',
              title: 'Pausar Variante com Fadiga de Conteúdo no TikTok BR',
              why: 'Taxa de conversão caiu 18% em 48h. Hipótese de fadiga de criativo confirmada com 85% de confiabilidade.',
              level: 'LEVEL_1_OPERATIONAL',
              action: 'PAUSE',
              status: 'COMPLETED',
              confidence: '88%'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-gray-200 text-sm">{item.title}</span>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 font-mono text-[10px] border border-purple-500/20">
                  {item.level} | {item.action}
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed"><strong className="text-purple-400">Raciocínio ("WHY"):</strong> {item.why}</p>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-900">
                <span>Status: <strong className="text-emerald-400">{item.status}</strong></span>
                <span>Score de Confiança: <strong className="text-purple-300">{item.confidence}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
