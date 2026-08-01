'use client';

import { useState, useEffect } from 'react';
import {
  Zap,
  TrendingUp,
  Award,
  Filter,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function OpportunitiesPage() {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [filterClassification, setFilterClassification] = useState<string>('ALL');

  // Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simPrice, setSimPrice] = useState('899.00');
  const [simPrevPrice, setSimPrevPrice] = useState('1099.00');
  const [simRating, setSimRating] = useState('4.8');
  const [simReviews, setSimReviews] = useState('1500');
  const [simCommission, setSimCommission] = useState('0.08');
  const [simInStock, setSimInStock] = useState(true);
  const [simResult, setSimResult] = useState<any>(null);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const url = filterClassification !== 'ALL'
        ? `/api/opportunities?classification=${filterClassification}`
        : '/api/opportunities';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setSnapshots(data.snapshots || []);
    } catch (err) {
      console.error('Erro ao carregar oportunidades:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [filterClassification]);

  const handleRecalculateAll = async () => {
    setRecalculating(true);
    try {
      await fetch('/api/opportunities/recalculate', { method: 'POST' });
      await loadOpportunities();
    } catch (err) {
      console.error('Erro ao recalcular:', err);
    } finally {
      setRecalculating(false);
    }
  };

  const handleRunSimulation = () => {
    const price = parseFloat(simPrice) || 0;
    const prevPrice = simPrevPrice ? parseFloat(simPrevPrice) : undefined;
    const rating = parseFloat(simRating) || 0;
    const reviews = parseInt(simReviews, 10) || 0;
    const commRate = parseFloat(simCommission) || 0.05;

    // Sub-score simulado
    let score = 50;
    if (price > 0 && price <= 1500) score += 20;
    if (prevPrice && prevPrice > price) score += 15;
    if (rating >= 4.5) score += 15;
    if (commRate >= 0.07) score += 10;
    if (!simInStock) score -= 30;

    score = Math.max(0, Math.min(100, score));

    let classification = 'GOOD';
    let priority = 'P2';
    if (score >= 90) { classification = 'EXCEPTIONAL'; priority = 'P0'; }
    else if (score >= 80) { classification = 'HIGH'; priority = 'P1'; }
    else if (score >= 70) { classification = 'GOOD'; priority = 'P2'; }
    else if (score >= 60) { classification = 'MODERATE'; priority = 'P3'; }
    else if (score >= 40) { classification = 'LOW'; priority = 'P4'; }
    else { classification = 'VERY_LOW'; priority = 'P4'; }

    const confidence = simInStock ? 85 : 40;
    const adjustedScore = Math.round(score * (0.5 + 0.5 * (confidence / 100)));

    setSimResult({
      score,
      confidenceScore: confidence,
      adjustedScore,
      classification,
      priority,
      positives: ['Preço dentro da faixa ideal de conversão', 'Excelente reputação e nota dos clientes'],
      negatives: !simInStock ? ['Produto fora de estoque (-30 pts)'] : [],
    });
  };

  // Estatísticas dos cards
  const exceptionalCount = snapshots.filter((s) => s.classification === 'EXCEPTIONAL').length;
  const highCount = snapshots.filter((s) => s.classification === 'HIGH').length;
  const goodCount = snapshots.filter((s) => s.classification === 'GOOD').length;
  const moderateCount = snapshots.filter((s) => s.classification === 'MODERATE').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Opportunity Engine</h1>
            <p className="text-xs text-gray-400">
              Classificação determinística de produtos (Score 0 a 100), priorização operacional e transparência de decisão.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-lg transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulador de Score</span>
          </button>

          <Link
            href="/settings/opportunity-engine"
            className="flex items-center gap-2 text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 px-3.5 py-2 rounded-lg transition-all"
          >
            <span>Configurações</span>
          </Link>

          <button
            onClick={handleRecalculateAll}
            disabled={recalculating}
            className="flex items-center gap-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
            <span>{recalculating ? 'Recalculando...' : 'Recalcular Todos'}</span>
          </button>
        </div>
      </div>

      {/* Simulator Component (Collapsible) */}
      {showSimulator && (
        <section className="bg-gray-900/95 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Simulador de Score em Tempo Real</span>
            </h2>
            <span className="text-[10px] text-gray-400">Teste parâmetros sem alterar o banco de dados</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">Preço Atual (R$)</label>
              <input
                type="number"
                value={simPrice}
                onChange={(e) => setSimPrice(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Preço Anterior (R$)</label>
              <input
                type="number"
                value={simPrevPrice}
                onChange={(e) => setSimPrevPrice(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Avaliação (0 - 5)</label>
              <input
                type="number"
                step="0.1"
                value={simRating}
                onChange={(e) => setSimRating(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Qtd. Reviews</label>
              <input
                type="number"
                value={simReviews}
                onChange={(e) => setSimReviews(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Taxa Comissão (%)</label>
              <input
                type="number"
                step="0.01"
                value={simCommission}
                onChange={(e) => setSimCommission(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunSimulation}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 rounded transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simular</span>
              </button>
            </div>
          </div>

          {simResult && (
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">Resultado da Simulação:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {simResult.classification} ({simResult.priority})
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center py-2 border-y border-gray-800">
                <div>
                  <span className="block text-[10px] text-gray-500">Opportunity Score</span>
                  <span className="text-xl font-extrabold text-amber-400">{simResult.score} pts</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500">Score de Confiança</span>
                  <span className="text-xl font-extrabold text-indigo-400">{simResult.confidenceScore}%</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500">Score Ajustado Operacional</span>
                  <span className="text-xl font-extrabold text-emerald-400">{simResult.adjustedScore} pts</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Cards por Classificação */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Excepcionais (P0)</span>
          <div className="text-2xl font-extrabold text-gray-100">{exceptionalCount}</div>
          <p className="text-[11px] text-gray-500">Score 90 – 100 (Prioridade Máxima)</p>
        </div>

        <div className="bg-gray-900/90 border border-indigo-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-400">Altas (P1)</span>
          <div className="text-2xl font-extrabold text-gray-100">{highCount}</div>
          <p className="text-[11px] text-gray-500">Score 80 – 89</p>
        </div>

        <div className="bg-gray-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400">Boas (P2)</span>
          <div className="text-2xl font-extrabold text-gray-100">{goodCount}</div>
          <p className="text-[11px] text-gray-500">Score 70 – 79</p>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400">Moderadas (P3)</span>
          <div className="text-2xl font-extrabold text-gray-100">{moderateCount}</div>
          <p className="text-[11px] text-gray-500">Score 60 – 69</p>
        </div>
      </div>

      {/* Filtros e Tabela de Oportunidades */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Oportunidades Classificadas ({snapshots.length})
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-400">Filtrar:</span>
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded px-2.5 py-1 text-gray-200"
            >
              <option value="ALL">Todas as Classificações</option>
              <option value="EXCEPTIONAL">EXCEPTIONAL (P0)</option>
              <option value="HIGH">HIGH (P1)</option>
              <option value="GOOD">GOOD (P2)</option>
              <option value="MODERATE">MODERATE (P3)</option>
              <option value="LOW">LOW (P4)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-xs text-gray-500">Carregando snapshots de oportunidade...</div>
        ) : snapshots.length === 0 ? (
          <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-xl p-8 text-center text-xs text-gray-400">
            Nenhuma oportunidade analisada ainda. Execute um recálculo acima ou adicione produtos.
          </div>
        ) : (
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Produto</th>
                    <th className="p-3.5">Score Final</th>
                    <th className="p-3.5">Score Ajustado</th>
                    <th className="p-3.5">Confiança</th>
                    <th className="p-3.5">Classificação</th>
                    <th className="p-3.5">Preço Atual</th>
                    <th className="p-3.5">Comissão Est.</th>
                    <th className="p-3.5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {snapshots.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-gray-200 truncate">{s.product?.title || 'Produto'}</div>
                        <div className="text-[11px] text-gray-500 truncate">{s.product?.category || 'Geral'}</div>
                      </td>

                      <td className="p-3.5 font-extrabold text-amber-400 text-sm">
                        {s.score?.toFixed(0)} <span className="text-[10px] text-gray-500">pts</span>
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400">
                        {s.adjustedScore?.toFixed(0)} <span className="text-[10px] text-gray-500">pts</span>
                      </td>

                      <td className="p-3.5 text-indigo-300 font-semibold">
                        {s.confidenceScore?.toFixed(0)}%
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                            s.classification === 'EXCEPTIONAL'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : s.classification === 'HIGH'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                              : s.classification === 'GOOD'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-gray-800 text-gray-400 border-gray-700'
                          }`}
                        >
                          {s.classification} ({s.priority})
                        </span>
                      </td>

                      <td className="p-3.5 font-bold text-gray-200">
                        R$ {s.product?.currentPrice?.toFixed(2) || '0.00'}
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400">
                        R$ {s.product?.estimatedCommission?.toFixed(2) || '0.00'}
                      </td>

                      <td className="p-3.5">
                        <Link
                          href={`/products/${s.productId}`}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <span>Detalhes</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
