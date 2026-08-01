'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([
    {
      id: 'appr_101',
      type: 'CAMPAIGN_PROPOSAL',
      title: 'Proposta de Escalonamento Agressivo (+20%)',
      description: 'Campanha "Expansion US Home" superou meta de ROI por 7 dias consecutivos (172% ROI). Solicita aumento de orçamento de $8,200 para $9,840.',
      riskLevel: 'HIGH',
      proposedBy: 'AutonomousGrowthEngine',
      createdAt: '2026-07-31 15:30'
    },
    {
      id: 'appr_102',
      type: 'BUDGET_REALLOCATION',
      title: 'Realocação de Orçamento Inter-Campanhas',
      description: 'Transferir $1,500 de "Fashion DE" (ROI 121%) para "Tech BR" (ROI 171%) para maximizar o retorno marginal.',
      riskLevel: 'MEDIUM',
      proposedBy: 'BudgetReallocationEngine',
      createdAt: '2026-07-31 14:15'
    }
  ]);

  const handleDecision = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setApprovals(approvals.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          Fila de Aprovações Humanas (Human-in-the-loop)
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Garantia de segurança: propostas autônomas de alto risco e aumentos de orçamento exigem confirmação do operador.
        </p>
      </div>

      {approvals.length === 0 ? (
        <div className="p-12 text-center bg-gray-900/40 border border-gray-800 rounded-2xl space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-200">Fila Vazia</h3>
          <p className="text-xs text-gray-400">Nenhuma solicitação de aprovação pendente no momento.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {approvals.map((appr) => (
            <div key={appr.id} className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">{appr.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      appr.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      Risco {appr.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{appr.description}</p>
                </div>
                <span className="text-[10px] font-mono text-gray-500">{appr.createdAt}</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800/60">
                <button
                  onClick={() => handleDecision(appr.id, 'REJECTED')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Rejeitar
                </button>
                <button
                  onClick={() => handleDecision(appr.id, 'APPROVED')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" /> Aprovar e Executar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
