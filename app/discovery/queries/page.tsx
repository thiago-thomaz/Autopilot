'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Play, Trash2, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function DiscoveryQueriesPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('amazon-brasil');
  const [queryStr, setQueryStr] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [creating, setCreating] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);

  const loadQueries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/discovery/queries');
      const data = await res.json();
      if (data.success) setQueries(data.queries || []);
    } catch (err) {
      console.error('Erro ao carregar consultas salvas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleCreateQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !queryStr) return;
    setCreating(true);

    try {
      const res = await fetch('/api/discovery/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          platform,
          query: queryStr,
          category: category || undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setName('');
        setQueryStr('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        await loadQueries();
      }
    } catch (err) {
      console.error('Erro ao criar consulta:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleRunQuery = async (id: string) => {
    setRunningId(id);
    try {
      await fetch(`/api/discovery/queries/${id}/run`, { method: 'POST' });
      alert('Busca executada e produtos importados com sucesso!');
    } catch (err) {
      console.error('Erro ao rodar consulta:', err);
    } finally {
      setRunningId(null);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    if (!confirm('Deseja excluir esta consulta salva?')) return;
    try {
      await fetch(`/api/discovery/queries/${id}`, { method: 'DELETE' });
      await loadQueries();
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <Link href="/discovery" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Descoberta</span>
      </Link>

      <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-100">Consultas Salvas de Descoberta</h1>
          <p className="text-xs text-gray-400">
            Cadastre termos e critérios recorrentes para execução manual ou automatizada no n8n.
          </p>
        </div>
      </div>

      {/* Form Criar Consulta */}
      <section className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Nova Consulta Salva</h2>

        <form onSubmit={handleCreateQuery} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Nome Identificador *</label>
              <input
                type="text"
                placeholder="ex: Monitores Gamers em Promoção"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Plataforma *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
              >
                <option value="amazon-brasil">Amazon Brasil</option>
                <option value="mercado-livre">Mercado Livre</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Termo de Busca (Query) *</label>
              <input
                type="text"
                placeholder="ex: Monitor 144Hz"
                value={queryStr}
                onChange={(e) => setQueryStr(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{creating ? 'Salvando...' : 'Salvar Consulta'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Lista de Consultas */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Consultas Ativas ({queries.length})</h2>

        {loading ? (
          <div className="text-xs text-gray-500">Carregando consultas...</div>
        ) : queries.length === 0 ? (
          <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-xl p-6 text-center text-xs text-gray-400">
            Nenhuma consulta salva ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queries.map((q) => (
              <div key={q.id} className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-200 text-sm">{q.name}</h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                      {q.platform}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-mono">Query: "{q.query}"</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs">
                  <button
                    onClick={() => handleRunQuery(q.id)}
                    disabled={runningId === q.id}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{runningId === q.id ? 'Executando...' : 'Executar Agora'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteQuery(q.id)}
                    className="text-gray-500 hover:text-rose-400 p-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
