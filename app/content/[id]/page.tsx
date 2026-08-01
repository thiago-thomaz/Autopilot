'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FileText,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Eye,
  Video,
  Share2,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function ContentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [pkg, setPkg] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>('INSTAGRAM');
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadPackage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/${id}`);
      const data = await res.json();
      if (data.success) {
        setPkg(data.package);
        setSelectedChannel(data.package.channel);
      }
    } catch (err) {
      console.error('Erro ao carregar pacote:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPreview = async (channel: string) => {
    try {
      const res = await fetch(`/api/content/${id}/preview?channel=${channel}`);
      const data = await res.json();
      if (data.success) setPreviewData(data.preview);
    } catch (err) {
      console.error('Erro ao carregar preview:', err);
    }
  };

  useEffect(() => {
    if (id) {
      loadPackage();
    }
  }, [id]);

  useEffect(() => {
    if (id && selectedChannel) {
      loadPreview(selectedChannel);
    }
  }, [id, selectedChannel]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await fetch(`/api/content/${id}/approve`, { method: 'POST' });
      await loadPackage();
    } catch (err) {
      console.error('Erro ao aprovar:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await fetch(`/api/content/${id}/reject`, { method: 'POST' });
      await loadPackage();
    } catch (err) {
      console.error('Erro ao rejeitar:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setActionLoading(true);
    try {
      await fetch(`/api/content/${id}/regenerate`, { method: 'POST' });
      await loadPackage();
    } catch (err) {
      console.error('Erro ao regenerar:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-gray-400">Carregando detalhes do pacote de conteúdo...</div>;
  }

  if (!pkg) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4 text-xs text-rose-400">
        Pacote de conteúdo não encontrado.
        <Link href="/content" className="block text-emerald-400 hover:underline mt-2">
          Voltar para Lista de Conteúdos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Botão Voltar */}
      <Link href="/content" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Lista de Conteúdos</span>
      </Link>

      {/* Header do Pacote */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase">
              Ângulo: {pkg.angle}
            </span>
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
          </div>
          <h1 className="text-xl font-bold text-gray-100">{pkg.title}</h1>
          <p className="text-xs text-gray-400 mt-1">Produto: {pkg.product?.title}</p>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={actionLoading}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
            <span>Regenerar</span>
          </button>

          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold px-3 py-2 rounded-lg text-xs border border-rose-500/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejeitar</span>
          </button>

          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Aprovar para Publicação</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Editor / Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna Esquerda: Estrutura do Pacote */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2 border-b border-gray-800 pb-3">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Estrutura do Pacote de Conteúdo</span>
          </h2>

          <div>
            <label className="block text-gray-500 text-[10px] uppercase font-bold mb-1">Hook (Gancho Inicial)</label>
            <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-amber-300 font-medium leading-relaxed">
              "{pkg.hook}"
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-[10px] uppercase font-bold mb-1">Legenda Completa (Caption)</label>
            <textarea
              readOnly
              value={pkg.caption}
              rows={8}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-gray-200 focus:outline-none font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-[10px] uppercase font-bold mb-1">Chamada para Ação (CTA)</label>
            <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-emerald-400 font-bold">
              {pkg.cta}
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-[10px] uppercase font-bold mb-1">Aviso Transparência Afiliado</label>
            <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-gray-400 italic">
              {pkg.affiliateDisclosure}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Simulated Channel Preview */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Preview por Canal Social</span>
            </h2>

            {/* Select Canal */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded px-2.5 py-1 text-gray-200 font-semibold"
            >
              <option value="INSTAGRAM">Instagram Post / Reels</option>
              <option value="TIKTOK">TikTok (Vídeo Curto 9:16)</option>
              <option value="YOUTUBE_SHORTS">YouTube Shorts</option>
              <option value="TELEGRAM">Telegram Channel</option>
              <option value="WORDPRESS">Blog (WordPress HTML)</option>
            </select>
          </div>

          {/* Visualização de Simulação */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 min-h-[350px] space-y-3 font-mono leading-relaxed whitespace-pre-wrap text-gray-200">
            {previewData ? previewData.formattedText : 'Carregando preview do canal...'}
          </div>
        </div>
      </div>
    </div>
  );
}
