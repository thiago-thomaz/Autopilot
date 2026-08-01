'use client';

import { useState, useEffect } from 'react';
import {
  Share2,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  RefreshCw,
  ExternalLink,
  Eye,
  Layers,
  Send,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function PublicationsPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [filterChannel, setFilterChannel] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const loadPublications = async () => {
    setLoading(true);
    try {
      let url = '/api/publications?limit=50';
      if (filterCountry !== 'ALL') url += `&country=${filterCountry}`;
      if (filterChannel !== 'ALL') url += `&channel=${filterChannel}`;
      if (filterStatus !== 'ALL') url += `&status=${filterStatus}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setPublications(data.publications || []);
    } catch (err) {
      console.error('Erro ao carregar publicações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, [filterCountry, filterChannel, filterStatus]);

  const handleProcessQueue = async () => {
    setProcessing(true);
    try {
      await fetch('/api/publications/1/publish', { method: 'POST' });
      await loadPublications();
    } catch (err) {
      console.error('Erro ao processar fila:', err);
    } finally {
      setProcessing(false);
    }
  };

  // Contadores por status
  const publishedCount = publications.filter((p) => p.status === 'PUBLISHED').length;
  const queuedCount = publications.filter((p) => p.status === 'QUEUED' || p.status === 'SCHEDULED').length;
  const manualCount = publications.filter((p) => p.status === 'MANUAL_REQUIRED').length;
  const failedCount = publications.filter((p) => p.status === 'FAILED').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Omnichannel Publication Engine</h1>
            <p className="text-xs text-gray-400">
              Distribuição internacional omnichannel (20 canais), agendamento assíncrono, consentimento e pacotes manuais.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/publications/accounts"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-gray-900 hover:bg-gray-800 px-3 py-2 rounded-lg border border-gray-800 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Contas Conectadas</span>
          </Link>

          <button
            onClick={handleProcessQueue}
            disabled={processing}
            className="flex items-center gap-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${processing ? 'animate-spin' : ''}`} />
            <span>Processar Fila Agora</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Publicados</span>
          <div className="text-2xl font-extrabold text-gray-100">{publishedCount}</div>
          <p className="text-[11px] text-gray-500">Postagens ativas com URL externa</p>
        </div>

        <div className="bg-gray-900/90 border border-indigo-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-400">Na Fila / Agendados</span>
          <div className="text-2xl font-extrabold text-gray-100">{queuedCount}</div>
          <p className="text-[11px] text-gray-500">Aguardando horário de janela</p>
        </div>

        <div className="bg-gray-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400">Ação Manual Requerida</span>
          <div className="text-2xl font-extrabold text-gray-100">{manualCount}</div>
          <p className="text-[11px] text-gray-500">Canais sem API aberta (Reddit/Custom)</p>
        </div>

        <div className="bg-gray-900/90 border border-rose-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-400">Falhas / Erros</span>
          <div className="text-2xl font-extrabold text-gray-100">{failedCount}</div>
          <p className="text-[11px] text-gray-500">Tentativas interrompidas</p>
        </div>
      </div>

      {/* Tabela de Publicações */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Publicações Omnichannel ({publications.length})
          </h2>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-400">País:</span>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="bg-gray-950 border border-gray-800 rounded px-2.5 py-1 text-gray-200"
              >
                <option value="ALL">Todos os Países</option>
                <option value="BR">Brasil (BR)</option>
                <option value="US">Estados Unidos (US)</option>
                <option value="GB">Reino Unido (GB)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-400">Canal:</span>
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="bg-gray-950 border border-gray-800 rounded px-2.5 py-1 text-gray-200"
              >
                <option value="ALL">Todos os Canais</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="TELEGRAM">Telegram</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="REDDIT">Reddit (Manual)</option>
                <option value="OWN_WEBSITE">Site Próprio</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-xs text-gray-500">Carregando publicações...</div>
        ) : publications.length === 0 ? (
          <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-xl p-8 text-center text-xs text-gray-400">
            Nenhuma publicação enfileirada ou executada ainda. Agende pacotes a partir do Content Engine.
          </div>
        ) : (
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Título / Produto</th>
                    <th className="p-3.5">Canal</th>
                    <th className="p-3.5">País / Moeda</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Agendado Para</th>
                    <th className="p-3.5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {publications.map((pub) => (
                    <tr key={pub.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-gray-200 truncate">{pub.contentPackage?.title || 'Publicação'}</div>
                        <div className="text-[11px] text-gray-500 truncate">{pub.contentPackage?.product?.title || 'Produto'}</div>
                      </td>

                      <td className="p-3.5 font-bold text-indigo-400 text-[11px]">
                        {pub.channel}
                      </td>

                      <td className="p-3.5 text-gray-300 font-semibold">
                        {pub.country} ({pub.currency})
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                            pub.status === 'PUBLISHED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : pub.status === 'QUEUED' || pub.status === 'SCHEDULED'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                              : pub.status === 'MANUAL_REQUIRED'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {pub.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-gray-400 text-[11px]">
                        {new Date(pub.scheduledAt).toLocaleString()}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/publications/${pub.id}`}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detalhes</span>
                          </Link>

                          {pub.externalUrl && (
                            <a
                              href={pub.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Ver Post</span>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
