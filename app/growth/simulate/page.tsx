'use client';

import React, { useState } from 'react';
import { Sliders, Sparkles, Play, BarChart2 } from 'lucide-react';

export default function SimulatorPage() {
  const [budget, setBudget] = useState(10000);
  const [targetROI, setTargetROI] = useState(30);
  const [riskTolerance, setRiskTolerance] = useState('BALANCED');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/growth/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalBudget: budget,
          allocations: [
            { category: 'HARVEST', amount: budget * 0.5, estimatedROI: targetROI * 1.2 },
            { category: 'EXPANSION', amount: budget * 0.3, estimatedROI: targetROI },
            { category: 'EXPLORATION', amount: budget * 0.2, estimatedROI: targetROI * 0.6 }
          ]
        })
      });
      const data = await res.json();
      setResult(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-emerald-400" />
          Simulador de Orçamento & Análise "What-If"
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Ferramenta probabilística interativa para simulação de cenários (Conservador, Base e Agressivo) antes de aplicar em produção.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Parâmetros de Simulação
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Orçamento Total Disponível ($):</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">ROI Esperado Alvo (%): {targetROI}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={targetROI}
              onChange={(e) => setTargetROI(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">Perfil de Tolerância ao Risco:</label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="CONSERVATIVE">Conservador (70% Harvest)</option>
              <option value="BALANCED">Equilibrado (50% Harvest / 30% Expansion / 20% Exploration)</option>
              <option value="AGGRESSIVE">Agressivo (35% Harvest / 40% Expansion / 25% Exploration)</option>
            </select>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full py-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow"
          >
            <Play className="w-4 h-4" />
            {loading ? 'Executando Simulação Monte Carlo...' : 'Executar Simulação What-If'}
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6">
          {!result ? (
            <div className="p-12 text-center bg-gray-900/40 border border-gray-800 rounded-2xl space-y-3">
              <BarChart2 className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-300">Pronto para Simular</h3>
              <p className="text-xs text-gray-500">
                Ajuste os parâmetros à esquerda e clique em "Executar Simulação" para visualizar as trajetórias probabilísticas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Cenário Conservador', data: result.scenarios.conservative, color: 'border-blue-800 bg-blue-950/20 text-blue-400' },
                { title: 'Cenário Base', data: result.scenarios.base, color: 'border-emerald-800 bg-emerald-950/20 text-emerald-400' },
                { title: 'Cenário Agressivo', data: result.scenarios.aggressive, color: 'border-purple-800 bg-purple-950/20 text-purple-400' }
              ].map((scen, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${scen.color} space-y-3 backdrop-blur`}>
                  <h3 className="font-bold text-sm text-white">{scen.title}</h3>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">Lucro Esperado:</div>
                    <div className="text-2xl font-extrabold text-white">${scen.data.expectedProfit.toLocaleString()}</div>
                  </div>
                  <div className="text-xs space-y-1 font-mono text-gray-300">
                    <div>ROI Esperado: <strong>{scen.data.expectedROI}%</strong></div>
                    <div>Prob. Lucratividade: <strong>{scen.data.probabilityOfProfitability}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
