'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Zap,
  ShieldAlert,
  AlertTriangle,
  Play,
  Pause,
  CheckCircle2,
  Sliders,
  BarChart3,
  Layers,
  Sparkles,
  ArrowUpRight,
  Activity
} from 'lucide-react';

export default function GrowthDashboardPage() {
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [shadowMode, setShadowMode] = useState(true);
  const [autonomyLevel, setAutonomyLevel] = useState('SUPERVISED');

  const toggleKillSwitch = async () => {
    const endpoint = killSwitchActive ? '/api/growth/resume' : '/api/growth/emergency-stop';
    try {
      await fetch(endpoint, { method: 'POST', body: JSON.stringify({ scope: 'GLOBAL' }) });
      setKillSwitchActive(!killSwitchActive);
    } catch (e) {
      setKillSwitchActive(!killSwitchActive);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              Módulo 11 — Autonomous Growth & Campaign Engine
            </h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Versão Internacional
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Motor autônomo de regência de crescimento, otimização de campanhas, experimentos e alocação dinâmica por retorno marginal.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleKillSwitch}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 border shadow-sm ${
              killSwitchActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                : 'bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {killSwitchActive ? 'DESATIVAR KILL SWITCH (RESUME)' : 'GLOBAL KILL SWITCH'}
          </button>

          <Link
            href="/growth/simulate"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-2"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            Simulador What-If
          </Link>
        </div>
      </div>

      {/* Safety Status Notification */}
      {killSwitchActive && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Disjuntor Global Ativo</h3>
            <p className="text-xs text-red-300">
              Todas as ações autônomas, postagens e realocações de orçamento foram pausadas preventivamente.
            </p>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Lucro Líquido Real (Net Profit)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">$42,850.40</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +24.5% vs. período anterior
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>ROI Médio da Carteira</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">184.2%</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Eficiência marginal otimizada
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Campanhas Ativas / Saúde</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">18 / 94.5%</div>
          <div className="text-xs text-cyan-400 font-medium">
            15 SAUDÁVEIS, 3 EM ATENÇÃO
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Modo de Operação / Shadow</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 tracking-tight flex items-center gap-2">
            <span>{autonomyLevel}</span>
            <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
              SHADOW
            </span>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Guardrails e aprovações ativos
          </div>
        </div>
      </div>

      {/* Navigation Quick Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
        <Link
          href="/growth"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        >
          Visão Geral
        </Link>
        <Link
          href="/growth/campaigns"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Gerenciador de Campanhas
        </Link>
        <Link
          href="/growth/approvals"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition flex items-center gap-1.5"
        >
          <span>Fila de Aprovações</span>
          <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">2</span>
        </Link>
        <Link
          href="/growth/simulate"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Simulador & What-If
        </Link>
      </div>

      {/* Main Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Campaigns Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Desempenho por Estratégia de Crescimento
              </h2>
              <Link href="/growth/campaigns" className="text-xs text-emerald-400 hover:underline">
                Ver todas →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { name: 'HARVEST — Tech & Gadgets (BR)', budget: '$12,500', profit: '$21,400', roi: '171%', strategy: 'HARVEST', health: 'HEALTHY' },
                { name: 'EXPANSION — Home Appliances (US)', budget: '$8,200', profit: '$14,100', roi: '172%', strategy: 'EXPANSION', health: 'HEALTHY' },
                { name: 'EXPLORATION — Fashion Deals (DE)', budget: '$3,500', profit: '$4,250', roi: '121%', strategy: 'EXPLORATION', health: 'WATCH' },
                { name: 'DEFENSE — Key Brand Keywords (BR)', budget: '$2,000', profit: '$3,100', roi: '155%', strategy: 'DEFENSE', health: 'HEALTHY' }
              ].map((cmp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 flex items-center justify-between hover:border-gray-700 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-200">{cmp.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {cmp.strategy}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-x-3">
                      <span>Orçamento: <strong className="text-gray-300">{cmp.budget}</strong></span>
                      <span>•</span>
                      <span>Lucro Líquido: <strong className="text-emerald-400">{cmp.profit}</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-white">{cmp.roi}</span>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {cmp.health}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Autonomous Action Queue & Safety Controls */}
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Fila de Ações Autônomas
            </h2>
            <div className="space-y-3">
              {[
                { title: 'Reescalonamento Incremental (+10%)', desc: 'Campanha Tech & Gadgets (BR) elegível por ROI > 25%', priority: 'P0', time: 'Há 5 min' },
                { title: 'A/B Test de Copy Hook', desc: 'Variante "Super Desconto" vs "Preço Histórico"', priority: 'P1', time: 'Há 22 min' },
                { title: 'Rotação de Criativos por Fadiga', desc: 'CTR caiu 12% nos últimos 3 dias', priority: 'P2', time: 'Há 1 hora' }
              ].map((task, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-200">{task.title}</span>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">{task.priority}</span>
                  </div>
                  <p className="text-xs text-gray-400">{task.desc}</p>
                  <span className="text-[10px] text-gray-500 block">{task.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
