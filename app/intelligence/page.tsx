'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Zap,
  ShieldAlert,
  Target,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ArrowUpRight
} from 'lucide-react';

export default function IntelligenceOverviewPage() {
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Módulo 13 — Autonomous Intelligence & Decision Layer
            </h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Enterprise Decision System
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Cérebro central de raciocínio causal, decisão autônoma hierárquica (L1-L3), consenso multi-agente e memória em 5 camadas.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setKillSwitchActive(!killSwitchActive)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 border shadow-sm ${
              killSwitchActive
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {killSwitchActive ? 'DESATIVAR KILL SWITCH' : 'INTELLIGENCE KILL SWITCH'}
          </button>
        </div>
      </div>

      {/* Safety Alert Notification */}
      {killSwitchActive && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Disjuntor de Inteligência Ativo</h3>
            <p className="text-xs text-red-300">
              Todas as decisões e execuções autônomas do Módulo 13 foram paralisadas e revertidas para modo de observação pura (OBSERVE).
            </p>
          </div>
        </div>
      )}

      {/* Core KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Score de Confiança Global</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">88.5%</div>
          <div className="text-xs text-purple-400 font-medium font-mono">Modelo: Ensemble Preditivo M9</div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Consenso Agentes (10/10)</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">92.0%</div>
          <div className="text-xs text-emerald-400 font-medium">Desvio Inter-Agente: 0.08 (Baixo)</div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Oportunidades Ativas</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">14 Detectadas</div>
          <div className="text-xs text-cyan-400 font-medium">Lucro Esperado: +$7,700/mês</div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Memórias em 5 Camadas</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">1,240 Registros</div>
          <div className="text-xs text-amber-400 font-medium">Taxa de Decaimento: 0.01/dia</div>
        </div>
      </div>

      {/* Navigation Sub-Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-800 pb-3">
        <Link
          href="/intelligence"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30"
        >
          Overview Inteligência
        </Link>
        <Link
          href="/intelligence/decisions"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Centro de Decisões & Diário
        </Link>
        <Link
          href="/intelligence/opportunities"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Radar Oportunidades
        </Link>
        <Link
          href="/intelligence/risks"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Radar Riscos
        </Link>
        <Link
          href="/intelligence/memory"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Inspector de Memória
        </Link>
        <Link
          href="/intelligence/agents"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Status dos Agentes (10)
        </Link>
        <Link
          href="/intelligence/learning"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Learning Center (Expected vs Actual)
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Decisões Recentes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Decisões Autônomas Recentes (Com Justificativa Estruturada "WHY")
            </h2>

            <div className="space-y-3">
              {[
                {
                  title: 'Escalar Campanha Amazon Tech US (L1 Operacional)',
                  why: 'CVR manteve-se a 4.5% com EPC de $18.50. O desvio de consenso inter-agente é 0.05 e o risco financeiro está abaixo de 15%.',
                  level: 'LEVEL_1_OPERATIONAL',
                  status: 'APPROVED',
                  confidence: '91%'
                },
                {
                  title: 'Rebalancear 15% do Orçamento para Mercado DE (L2 Tático)',
                  why: 'Detectada lacuna de mercado com ROI projetado de 32%. A trava de caixa do M12 está em estado NORMAL.',
                  level: 'LEVEL_2_TACTICAL',
                  status: 'EXECUTING',
                  confidence: '86%'
                },
                {
                  title: 'Entrada em Novo Modelo de Negócio Deal Affiliate (L3 Estratégico)',
                  why: 'Requer aprovação humana prévia por envolver alteração de modelo de negócio e investimento acima do limite autônomo.',
                  level: 'LEVEL_3_STRATEGIC',
                  status: 'PENDING_APPROVAL',
                  confidence: '78%'
                }
              ].map((d, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-gray-200">{d.title}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono text-[10px]">
                      {d.level}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed"><strong className="text-purple-300">WHY:</strong> {d.why}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>Status: <strong className="text-emerald-400">{d.status}</strong></span>
                    <span>Confiança: <strong className="text-purple-300">{d.confidence}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 10 Specialized Agents Status */}
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              Consenso dos 10 Agentes Especializados
            </h2>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Market Intelligence Agent', vote: 'APPROVE', weight: '15%' },
                { name: 'Product Intelligence Agent', vote: 'APPROVE', weight: '15%' },
                { name: 'Content Intelligence Agent', vote: 'APPROVE', weight: '10%' },
                { name: 'Channel Intelligence Agent', vote: 'APPROVE', weight: '10%' },
                { name: 'Affiliate Intelligence Agent', vote: 'APPROVE', weight: '10%' },
                { name: 'Financial Intelligence Agent', vote: 'APPROVE', weight: '15%' },
                { name: 'Risk & Compliance Agent', vote: 'APPROVE', weight: '10%' },
                { name: 'Experimentation Agent', vote: 'APPROVE', weight: '5%' },
                { name: 'Growth Agent', vote: 'APPROVE', weight: '5%' },
                { name: 'Strategy Agent', vote: 'APPROVE', weight: '5%' }
              ].map((ag, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-gray-950/60 border border-gray-800 flex items-center justify-between font-mono">
                  <span className="text-gray-300 font-medium">{ag.name}</span>
                  <div className="space-x-2">
                    <span className="text-emerald-400 font-bold text-[10px]">{ag.vote}</span>
                    <span className="text-gray-500 text-[10px]">({ag.weight})</span>
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
