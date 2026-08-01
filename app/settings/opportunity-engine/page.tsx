'use client';

import { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, ArrowLeft, Info, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OpportunityEngineSettingsPage() {
  const [weights, setWeights] = useState({
    priceOffer: 0.20,
    priceHistory: 0.15,
    rating: 0.10,
    reviewVolume: 0.10,
    commission: 0.15,
    demand: 0.10,
    availability: 0.05,
    contentPotential: 0.10,
    dataQuality: 0.05,
  });

  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaved(false);

    if (Math.abs(totalWeight - 1.0) > 0.001) {
      setErrorMsg(`A soma exata dos pesos deve ser 1.0 (100%). Atualmente está em ${(totalWeight * 100).toFixed(1)}%.`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/opportunity-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithmVersion: 'v1.0.0',
          weights,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setErrorMsg(data.error || 'Erro ao salvar configurações.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <Link href="/opportunities" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Oportunidades</span>
      </Link>

      <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-100">Configurações do Opportunity Engine</h1>
          <p className="text-xs text-gray-400">
            Ajuste fino dos pesos dos sub-scores (a soma dos pesos deve totalizar exatamente 100%).
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuração salva com sucesso! Algoritmo atualizado.</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-3 text-xs font-semibold text-rose-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Distribuição de Pesos</span>
          <span
            className={`text-xs font-extrabold px-2.5 py-0.5 rounded ${
              Math.abs(totalWeight - 1.0) < 0.001
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            Soma: {(totalWeight * 100).toFixed(0)}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">Preço / Oferta ({ (weights.priceOffer * 100).toFixed(0) }%)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={weights.priceOffer}
              onChange={(e) => setWeights({ ...weights, priceOffer: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Histórico de Preço ({ (weights.priceHistory * 100).toFixed(0) }%)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={weights.priceHistory}
              onChange={(e) => setWeights({ ...weights, priceHistory: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Avaliação do Cliente ({ (weights.rating * 100).toFixed(0) }%)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={weights.rating}
              onChange={(e) => setWeights({ ...weights, rating: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Volume de Reviews ({ (weights.reviewVolume * 100).toFixed(0) }%)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={weights.reviewVolume}
              onChange={(e) => setWeights({ ...weights, reviewVolume: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Comissão ({ (weights.commission * 100).toFixed(0) }%)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={weights.commission}
              onChange={(e) => setWeights({ ...weights, commission: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Demanda Observada ({ (weights.demand * 100).toFixed(0) }%)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={weights.demand}
              onChange={(e) => setWeights({ ...weights, demand: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Disponibilidade / Estoque ({ (weights.availability * 100).toFixed(0) }%)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={weights.availability}
              onChange={(e) => setWeights({ ...weights, availability: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Potencial de Conteúdo ({ (weights.contentPotential * 100).toFixed(0) }%)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={weights.contentPotential}
              onChange={(e) => setWeights({ ...weights, contentPotential: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-200"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Alterações de Pesos'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
