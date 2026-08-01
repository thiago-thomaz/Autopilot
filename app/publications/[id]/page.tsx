'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Copy,
  ExternalLink,
  Layers,
  ShieldCheck,
  RefreshCw,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function PublicationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [pub, setPub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadPublication = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/publications/${id}`);
      const data = await res.json();
      if (data.success) setPub(data.publication);
    } catch (err) {
      console.error('Erro ao carregar publicação:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadPublication();
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-xs text-gray-400">Carregando detalhes da publicação...</div>;
  if (!pub) return <div className="p-8 text-xs text-rose-400">Registro de publicação não encontrado.</div>;

  const isManual = pub.status === 'MANUAL_REQUIRED' || pub.publicationType === 'MANUAL';
  const manualData = pub.publicationPayload;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <Link href="/publications" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Publicações</span>
      </Link>

      {/* Header */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase">
              Canal: {pub.channel}
            </span>
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
              Mercado: {pub.country} ({pub.currency})
            </span>
            <span
              className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                pub.status === 'PUBLISHED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : pub.status === 'MANUAL_REQUIRED'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
              }`}
            >
              {pub.status}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-100">{pub.contentPackage?.title}</h1>
          <p className="text-xs text-gray-400 mt-1">ID Idempotência: {pub.idempotencyKey}</p>
        </div>

        {pub.externalUrl && (
          <a
            href={pub.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Post Publicado</span>
          </a>
        )}
      </div>

      {/* PACOTE DE PUBLICAÇÃO MANUAL (WHY MANUAL?) */}
      {isManual && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>PACOTE DE PUBLICAÇÃO MANUAL (WHY MANUAL?)</span>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl border border-amber-500/20 space-y-2">
            <span className="text-gray-400 font-semibold">Justificativa técnica (WHY MANUAL?):</span>
            <p className="text-amber-300">
              {manualData?.whyManualReason || 'Esta rede exige publicação manual e aprovação da comunidade para evitar banimentos por automação.'}
            </p>
          </div>

          {manualData?.formattedText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-bold">Conteúdo Prontinho para Copiar:</span>
                <button
                  onClick={() => copyToClipboard(manualData.formattedText)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={manualData.formattedText}
                rows={6}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-200 font-mono focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Carga Útil (Payload) */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-3 text-xs shadow-xl">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Carga Útil da Publicação (Payload)</h2>
        <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
          {pub.publicationPayload?.body || 'Sem payload customizado'}
        </div>
      </div>
    </div>
  );
}
