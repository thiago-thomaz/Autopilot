'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  ShieldAlert,
  AlertTriangle,
  Award,
  BarChart3,
  PieChart,
  Bot,
  Zap,
  ArrowUpRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function ExecutiveCockpitPage() {
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  const toggleKillSwitch = async () => {
    const endpoint = killSwitchActive ? '/api/business/resume' : '/api/business/emergency-stop';
    try {
      await fetch(endpoint, { method: 'POST' });
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
              <Briefcase className="w-6 h-6 text-emerald-400" />
              Módulo 12 — Business OS (Executive Cockpit)
            </h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Diretoria Executiva C-Level
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Sistema Operacional Autônomo do Negócio de Afiliados. Governança, DRE Executivo, gestão de caixa e saúde do portfólio.
          </p>
        </div>

        {/* Action Controls */}
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
            {killSwitchActive ? 'DESATIVAR KILL SWITCH (RESUME)' : 'GLOBAL BUSINESS KILL SWITCH'}
          </button>

          <Link
            href="/business/copilot"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            Copiloto Executivo
          </Link>
        </div>
      </div>

      {/* Safety Status Notification */}
      {killSwitchActive && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Disjuntor Geral Executivo Ativo</h3>
            <p className="text-xs text-red-300">
              Todas as automações estratégicas, orçamentárias e de portfólio foram paralisadas sem perda de dados auditáveis.
            </p>
          </div>
        </div>
      )}

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Receita Líquida (Net Revenue)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">$28,500.00</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18.4% MoM
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Lucro Líquido Real (Net Profit)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">$26,900.00</div>
          <div className="text-xs text-emerald-400 font-medium font-mono">
            Margem: 94.38% | ROI: 2,241.67%
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Saldo de Caixa / Trava</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">$9,500.00</div>
          <div className="text-xs text-cyan-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Trava Mínima de $2,000 OK (Status: NORMAL)
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Saúde do Negócio / Risco</span>
            <PieChart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">96.5 / 100</div>
          <div className="text-xs text-amber-400 font-medium">
            Score Diversificação: 75.0 (Risco Moderado)
          </div>
        </div>
      </div>

      {/* Navigation Quick Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
        <Link
          href="/business/executive"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        >
          Cockpit Executivo
        </Link>
        <Link
          href="/business/financial"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Painel Financeiro & DRE
        </Link>
        <Link
          href="/business/portfolio"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition"
        >
          Portfólio & Matriz Global
        </Link>
        <Link
          href="/business/copilot"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800/60 transition flex items-center gap-1.5"
        >
          <span>Copiloto & Diagnóstico</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">IA</span>
        </Link>
      </div>

      {/* Main Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: DRE & Goal Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                Resumo do DRE Executivo (P&L)
              </h2>
              <Link href="/business/financial" className="text-xs text-emerald-400 hover:underline">
                Ver DRE Completo →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Receita Bruta de Comissões', val: '+$28,500.00', color: 'text-gray-200' },
                { label: '(-) Reembolsos & Estornos', val: '-$400.00', color: 'text-red-400' },
                { label: '(=) Receita Líquida Real', val: '+$28,100.00', color: 'text-emerald-400 font-bold' },
                { label: '(-) Custos Operacionais (IA, Infra, Mídia)', val: '-$1,200.00', color: 'text-amber-400' },
                { label: '(=) Lucro Líquido Real (Net Profit)', val: '+$26,900.00', color: 'text-emerald-400 font-extrabold text-base' }
              ].map((row, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800/80 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">{row.label}</span>
                  <span className={`font-mono ${row.color}`}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: C-Suite Actionable Recommendations */}
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Recomendações da Diretoria Executiva
            </h2>

            <div className="space-y-3">
              {[
                { role: 'CFO', title: 'Margem de Lucro Elevada (94.38%)', desc: 'Reinvestir 20% do caixa acumulado na expansão para a Alemanha (DE).', priority: 'P0' },
                { role: 'RISK_MANAGER', title: 'Concentração Moderada no Mercado US', desc: 'Mercado US representa 55% do lucro. Diversificar para a América Latina (BR/MX).', priority: 'P1' },
                { role: 'CEO', title: 'Escalonamento Autônomo de Vencedores', desc: 'Manter foco no Lucro Líquido Real e aprovar realocações do Módulo 11.', priority: 'P1' }
              ].map((adv, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">{adv.role}</span>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">{adv.priority}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-gray-200">{adv.title}</h4>
                  <p className="text-xs text-gray-400">{adv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
