'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Filter,
  RefreshCw,
  ExternalLink,
  Eye,
  Video,
  Share2,
  Clock,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function ContentPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterChannel, setFilterChannel] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const loadPackages = async () => {
    setLoading(true);
    try {
      let url = '/api/content?limit=50';
      if (filterChannel !== 'ALL') url += `&channel=${filterChannel}`;
      if (filterStatus !== 'ALL') url += `&status=${filterStatus}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setPackages(data.packages || []);
    } catch (err) {
      console.error('Erro ao carregar pacotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [filterChannel, filterStatus]);

  // Contadores
  const readyCount = packages.filter((p) => p.status === 'READY_FOR_PUBLICATION').length;
  const reviewCount = packages.filter((p) => p.status === 'REVIEW_REQUIRED').length;
  const rejectedCount = packages.filter((p) => p.status === 'REJECTED').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Content Engine</h1>
            <p className="text-xs text-gray-400">
              Pacotes de conteúdo multimídia, roteiros de vídeos curtos, briefs visuais e auditoria anti-alucinação.
            </p>
          </div>
        </div>

        <Link
          href="/opportunities"
          className="flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gerar a partir de Oportunidade</span>
        </Link>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Prontos para Publicação</span>
          <div className="text-2xl font-extrabold text-gray-100">{readyCount}</div>
          <p className="text-[11px] text-gray-500">Quality Score &ge; 80 e Compliance OK</p>
        </div>

        <div className="bg-gray-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400">Revisão Necessária</span>
          <div className="text-2xl font-extrabold text-gray-100">{reviewCount}</div>
          <p className="text-[11px] text-gray-500">Exige revisão humana ou ajuste de alegações</p>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] uppercase font-bold text-rose-400">Rejeitados</span>
          <div className="text-2xl font-extrabold text-gray-100">{rejectedCount}</div>
          <p className="text-[11px] text-gray-500">Pacotes não aprovados</p>
        </div>
      </div>

      {/* Tabela de Conteúdos */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Pacotes de Conteúdo Gerados ({packages.length})
          </h2>

          <div className="flex items-center gap-4 text-xs">
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
                <option value="TIKTOK">TikTok</option>
                <option value="YOUTUBE_SHORTS">YouTube Shorts</option>
                <option value="TELEGRAM">Telegram</option>
                <option value="WORDPRESS">Blog (WordPress)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-950 border border-gray-800 rounded px-2.5 py-1 text-gray-200"
              >
                <option value="ALL">Todos os Status</option>
                <option value="READY_FOR_PUBLICATION">READY_FOR_PUBLICATION</option>
                <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-xs text-gray-500">Carregando pacotes de conteúdo...</div>
        ) : packages.length === 0 ? (
          <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-xl p-8 text-center text-xs text-gray-400">
            Nenhum pacote de conteúdo gerado ainda. Acesse a aba de Oportunidades para gerar novos pacotes.
          </div>
        ) : (
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Produto / Título</th>
                    <th className="p-3.5">Ângulo</th>
                    <th className="p-3.5">Canal Alvo</th>
                    <th className="p-3.5">Quality Score</th>
                    <th className="p-3.5">Compliance</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-gray-200 truncate">{pkg.title}</div>
                        <div className="text-[11px] text-gray-500 truncate">{pkg.product?.title || 'Produto'}</div>
                      </td>

                      <td className="p-3.5 font-bold text-indigo-400 text-[11px]">
                        {pkg.angle}
                      </td>

                      <td className="p-3.5 text-gray-300 font-semibold">
                        {pkg.channel}
                      </td>

                      <td className="p-3.5 font-extrabold text-amber-400">
                        {pkg.qualityScore?.toFixed(0)} pts
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400">
                        {pkg.complianceScore?.toFixed(0)}%
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                            pkg.status === 'READY_FOR_PUBLICATION'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : pkg.status === 'REVIEW_REQUIRED'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {pkg.status}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <Link
                          href={`/content/${pkg.id}`}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview & Editor</span>
                        </Link>
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
