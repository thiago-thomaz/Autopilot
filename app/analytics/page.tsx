'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Percent,
  Layers,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  FileCheck,
  Zap,
  Globe,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/overview');
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error('Erro ao carregar analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-xs text-gray-400">Carregando dados analíticos...</div>;
  if (!data) return <div className="p-8 text-xs text-rose-400">Falha ao carregar métricas analíticas.</div>;

  const ov = data.overview;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Analytics, Attribution & Profit Intelligence</h1>
            <p className="text-xs text-gray-400">
              Desempenho financeiro real baseando a receita estritamente nas comissões aprovadas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/analytics/attribution"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-gray-900 hover:bg-gray-800 px-3 py-2 rounded-lg border border-gray-800 transition-all"
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Modelos de Atribuição</span>
          </Link>

          <Link
            href="/analytics/reconciliation"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-lg transition-all"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Conciliação de Vendas</span>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas Financeiras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Comissões (Receita Real)</span>
          <div className="text-2xl font-extrabold text-gray-100">R$ {ov.commissionRevenue.toFixed(2)}</div>
          <p className="text-[11px] text-gray-500">Ganhos confirmados de afiliados</p>
        </div>

        <div className="bg-gray-900/90 border border-rose-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-400">Custos Totais</span>
          <div className="text-2xl font-extrabold text-gray-100">R$ {ov.totalCosts.toFixed(2)}</div>
          <p className="text-[11px] text-gray-500">IA, APIs, Hospedagem e Mensagens</p>
        </div>

        <div className="bg-gray-900/90 border border-indigo-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-400">Lucro Líquido</span>
          <div className="text-2xl font-extrabold text-gray-100">R$ {ov.netProfit.toFixed(2)}</div>
          <p className="text-[11px] text-gray-500">Receita de Comissão - Custos</p>
        </div>

        <div className="bg-gray-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400">Retorno sobre Custo (ROI)</span>
          <div className="text-2xl font-extrabold text-gray-100">{ov.roi !== null ? `${ov.roi.toFixed(1)}%` : 'N/A'}</div>
          <p className="text-[11px] text-gray-500">Eficiência de capital investido</p>
        </div>
      </div>

      {/* Resumo de Insights em Linguagem Natural */}
      <div className="bg-gray-900/90 border border-indigo-500/30 rounded-2xl p-6 space-y-3 shadow-xl text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Insights Inteligentes de Performance</span>
        </div>
        <div className="space-y-2">
          {data.insights.map((ins: string, idx: number) => (
            <div key={idx} className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-gray-200 font-medium">
              {ins}
            </div>
          ))}
        </div>
      </div>

      {/* Visualização de Funil */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4 text-xs shadow-xl">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Funil de Conversão Omnichannel</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-500 uppercase text-[10px] font-bold">Cliques Totais</span>
            <div className="text-xl font-bold text-gray-200">{ov.totalClicks}</div>
          </div>
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-500 uppercase text-[10px] font-bold">Cliques Válidos</span>
            <div className="text-xl font-bold text-indigo-400">{ov.validClicks}</div>
          </div>
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-500 uppercase text-[10px] font-bold">Conversões</span>
            <div className="text-xl font-bold text-amber-400">{ov.conversions}</div>
          </div>
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
            <span className="text-gray-500 uppercase text-[10px] font-bold">Vendas Reconciliadas</span>
            <div className="text-xl font-bold text-emerald-400">{ov.sales}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
