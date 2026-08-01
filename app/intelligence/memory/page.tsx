'use client';

import React from 'react';
import { BookOpen, Layers, Database } from 'lucide-react';

export default function MemoryInspectorPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-400" />
          Inspector de Memória em 5 Camadas
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Navegador de memórias Episódica, Semântica, Estratégica, Procedural e Working Memory com governança de decaimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['EPISODIC', 'SEMANTIC', 'STRATEGIC', 'PROCEDURAL', 'WORKING'].map((layer, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-300 text-sm font-mono">{layer} MEMORY</h3>
              <span className="text-xs text-gray-500 font-mono">Decay: 0.01/dia</span>
            </div>
            <p className="text-xs text-gray-400">
              Registros e lições consolidadas para governança de decisões futuras e manutenção de contexto temporal.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
