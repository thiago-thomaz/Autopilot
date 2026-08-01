'use client';

import { Shield, ShieldAlert, Cpu } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 border-b border-gray-800 bg-gray-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-200">Painel de Controle</h2>
        <span className="text-xs text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
          v1.0.0 (Fundação)
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {/* Compliance Guard Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Compliance Ativo</span>
        </div>

        {/* n8n Status Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Cpu className="w-3.5 h-3.5" />
          <span>n8n Webhook: /api/n8n/events</span>
        </div>

        {/* Safe Mode Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Sem Integrações Reais</span>
        </div>
      </div>
    </header>
  );
}
