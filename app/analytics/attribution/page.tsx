'use client';

import { useState, useEffect } from 'react';
import { PieChart, ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AttributionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/attribution')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.comparison);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-xs text-gray-400">Carregando comparação de atribuição...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <Link href="/analytics" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Analytics</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Atribuição Multi-Touch Sem Duplicação</h1>
            <p className="text-xs text-gray-400">
              Comparação dos 5 modelos de atribuição (Last Click, First Click, Linear, Position-Based, Time Decay).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6 text-xs">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Divisão de Crédito por Modelo</h2>

        {data && (
          <div className="space-y-4">
            {Object.keys(data).map((modelKey) => {
              const res = data[modelKey];
              return (
                <div key={modelKey} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                  <div className="font-bold text-indigo-400 uppercase text-xs">{modelKey}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {res.touchpoints.map((tp: any, i: number) => (
                      <div key={i} className="bg-gray-900 p-2.5 rounded border border-gray-800 flex justify-between items-center">
                        <span className="text-gray-300 font-semibold">{tp.channel}</span>
                        <span className="text-emerald-400 font-bold">{(tp.credit * 100).toFixed(0)}% (R$ {tp.attributedCommission.toFixed(2)})</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
