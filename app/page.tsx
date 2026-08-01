'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Tag,
  FileText,
  Share2,
  MousePointerClick,
  ShoppingBag,
  Coins,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';

interface MetricItem {
  key: string;
  title: string;
  value: string;
  icon: any;
  emptyText: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula tempo de carregamento inicial para exibir Skeletons
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const metrics: MetricItem[] = [
    {
      key: 'products',
      title: 'Produtos Monitorados',
      value: '0',
      icon: Package,
      emptyText: '0 produtos monitorados — Comece conectando uma plataforma de afiliados.',
    },
    {
      key: 'offers',
      title: 'Ofertas Encontradas',
      value: '0',
      icon: Tag,
      emptyText: '0 ofertas encontradas — Oportunidades serão listadas aqui.',
    },
    {
      key: 'contents',
      title: 'Conteúdos Criados',
      value: '0',
      icon: FileText,
      emptyText: '0 conteúdos gerados — Prontos para revisão e compliance.',
    },
    {
      key: 'publications',
      title: 'Publicações',
      value: '0',
      icon: Share2,
      emptyText: '0 publicações efetuadas nos canais configurados.',
    },
    {
      key: 'clicks',
      title: 'Cliques',
      value: '0',
      icon: MousePointerClick,
      emptyText: '0 cliques registrados em seus links de afiliado.',
    },
    {
      key: 'conversions',
      title: 'Conversões',
      value: '0',
      icon: ShoppingBag,
      emptyText: '0 vendas convertidas identificadas.',
    },
    {
      key: 'commissions',
      title: 'Comissões',
      value: '0',
      icon: Coins,
      emptyText: 'R$ 0,00 em comissões calculadas.',
    },
    {
      key: 'revenue',
      title: 'Receita Est. Total',
      value: 'R$ 0,00',
      icon: DollarSign,
      emptyText: 'Receita acumulada de vendas geradas.',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Banner Informativo do Módulo 1 */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-gray-900 to-gray-900 border border-emerald-500/20 rounded-2xl p-6 shadow-lg flex items-start gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-100">
            Fundação da Plataforma (Módulo 1)
          </h2>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            Infraestrutura base modular, segura e preparada para futuras automações via n8n e integrações com programas de afiliados.
            Neste módulo, o modo de operação é estritamente <strong className="text-emerald-400">MANUAL</strong> e o disparo automático está desativado (<code className="text-amber-400">ENABLE_AUTOMATION=false</code>).
          </p>
        </div>
      </div>

      {/* Grid de Cards de Métricas */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Visão Geral da Operação
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.key}
                  className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition-all rounded-xl p-5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-400">{metric.title}</span>
                    <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-2">{metric.value}</div>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {metric.emptyText}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Estado Vazio Informativo Principal */}
      <section className="mt-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Atividades Recentes
        </h3>
        <EmptyState
          title="Nenhuma atividade registrada"
          description="Nenhuma oferta ou automação executada ainda. Conecte o n8n ou adicione sua primeira plataforma no próximo módulo."
        />
      </section>
    </div>
  );
}
