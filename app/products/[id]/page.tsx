'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Package,
  TrendingDown,
  Clock,
  ExternalLink,
  Tag,
  Star,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch(`/api/products/${id}/price-history`).then((r) => r.json()),
    ])
      .then(([resProd, resHist]) => {
        if (resProd.success) setProduct(resProd.product);
        if (resHist.success) setHistory(resHist.history || []);
      })
      .catch((err) => console.error('Erro ao carregar detalhes:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-xs text-gray-400">Carregando detalhes do produto...</div>;
  }

  if (!product) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <div className="text-rose-400 text-sm">Produto não encontrado.</div>
        <Link href="/discovery" className="text-xs text-emerald-400 hover:underline">
          Voltar para Descoberta
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Botão Voltar */}
      <Link href="/discovery" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Product Discovery</span>
      </Link>

      {/* Card Principal do Produto */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex items-center justify-center min-h-[220px]">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="max-h-48 object-contain rounded" />
          ) : (
            <Package className="w-16 h-16 text-gray-700" />
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {product.affiliatePlatform?.name || 'Afiliado'}
            </span>
            <h1 className="text-lg font-bold text-gray-100 mt-2">{product.title}</h1>
            <p className="text-xs text-gray-400 mt-1">{product.description || 'Sem descrição cadastrada.'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px]">Preço Atual</span>
              <span className="text-2xl font-bold text-emerald-400">R$ {product.currentPrice.toFixed(2)}</span>
            </div>

            {product.previousPrice && (
              <div>
                <span className="text-gray-500 block text-[10px]">Preço Anterior</span>
                <span className="text-sm text-gray-400 line-through">R$ {product.previousPrice.toFixed(2)}</span>
              </div>
            )}

            <div>
              <span className="text-gray-500 block text-[10px]">Score de Oportunidade</span>
              <span className="text-sm font-bold text-emerald-400">{product.opportunityScore?.toFixed(1) || '0.0'} pts</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs pt-2 border-t border-gray-800">
            <span className="bg-gray-950 px-2.5 py-1 rounded border border-gray-800 text-gray-300">
              ID Externo: <strong className="font-mono text-gray-200">{product.externalId}</strong>
            </span>
            <span className="bg-gray-950 px-2.5 py-1 rounded border border-gray-800 text-gray-300">
              Origem: <strong className="text-gray-200">{product.sourceType}</strong>
            </span>
            <a
              href={product.url}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1 rounded transition-all flex items-center gap-1.5 ml-auto"
            >
              <span>Ver no Site Original</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Seção Histórico de Preços */}
      <section className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>Histórico de Alterações de Preço ({history.length} registros)</span>
          </h2>
        </div>

        {history.length === 0 ? (
          <div className="text-xs text-gray-500 italic p-4 text-center">Nenhum histórico de preço registrado até o momento.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 font-semibold">
                  <th className="p-3">Data e Hora</th>
                  <th className="p-3">Preço Registrado</th>
                  <th className="p-3">Preço Anterior</th>
                  <th className="p-3">Desconto (%)</th>
                  <th className="p-3">Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/40">
                    <td className="p-3 text-gray-300 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span>{new Date(item.capturedAt).toLocaleString('pt-BR')}</span>
                    </td>
                    <td className="p-3 font-bold text-emerald-400">R$ {item.price.toFixed(2)}</td>
                    <td className="p-3 text-gray-400">{item.previousPrice ? `R$ ${item.previousPrice.toFixed(2)}` : '-'}</td>
                    <td className="p-3 font-semibold text-emerald-300">
                      {item.discountPercent ? `${item.discountPercent.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-3 text-gray-400">{item.source || 'API'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
