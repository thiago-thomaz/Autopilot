import { Clock, Info } from 'lucide-react';

interface ModulePlaceholderProps {
  moduleTitle: string;
  description?: string;
}

export function ModulePlaceholder({ moduleTitle, description }: ModulePlaceholderProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">{moduleTitle}</h1>
            <p className="text-xs text-gray-400">Fundação do Sistema — Affiliate Autopilot</p>
          </div>
        </div>

        <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-amber-200 leading-relaxed">
            Este módulo será ativado em uma próxima etapa.
          </p>
        </div>

        {description && (
          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
