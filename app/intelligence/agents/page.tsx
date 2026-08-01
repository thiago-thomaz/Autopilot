'use client';

import React from 'react';
import { Bot, CheckCircle2, Award } from 'lucide-react';

export default function AgentsCenterPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-emerald-400" />
          Status dos 10 Agentes Especializados
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitor de votos, pesos, níveis de confiança e análise inter-agente do AgentConsensusEngine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          'MarketIntelligenceAgent',
          'ProductIntelligenceAgent',
          'ContentIntelligenceAgent',
          'ChannelIntelligenceAgent',
          'AffiliateIntelligenceAgent',
          'FinancialIntelligenceAgent',
          'RiskComplianceAgent',
          'ExperimentationAgent',
          'GrowthAgent',
          'StrategyAgent'
        ].map((agentName, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-gray-200">{agentName}</span>
              <span className="text-emerald-400 font-mono text-[10px]">ACTIVE</span>
            </div>
            <div className="text-gray-400 font-mono text-[11px] pt-2 border-t border-gray-800">
              Score de Confiabilidade: <strong className="text-purple-300">0.90</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
