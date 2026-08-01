'use client';

import React from 'react';
import { Award, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function LearningCenterPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-400" />
          Learning Center (Expected vs Actual Outcomes)
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Acompanhamento em malha fechada entre o lucro líquido previsto (V_expected) e o realizado (V_actual).
        </p>
      </div>

      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Resultados Recentes de Aprendizado</h2>

        <div className="space-y-3 text-xs">
          {[
            {
              decisionId: 'dec_001',
              expected: '$4,500.00',
              actual: '$4,620.00',
              variance: '+$120.00',
              accuracy: '97.4%',
              status: 'SUCCESS'
            },
            {
              decisionId: 'dec_002',
              expected: '$3,200.00',
              actual: '$3,150.00',
              variance: '-$50.00',
              accuracy: '98.4%',
              status: 'SUCCESS'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between font-mono">
              <div>
                <span className="text-gray-400 block text-[10px]">Decisão: {item.decisionId}</span>
                <span className="text-white font-bold text-sm">Acurácia: {item.accuracy}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-[10px] block">Previsto vs Realizado</span>
                <span className="text-emerald-400 font-bold">{item.actual} ({item.variance})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
