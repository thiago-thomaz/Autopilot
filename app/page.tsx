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
  Zap,
  RefreshCw,
  Sparkles,
  Send,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';

interface MetricItem {
  key: string;
  title: string;
  value: string;
  icon: any;
  emptyText: string;
  href: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({
    products: 0,
    offers: 0,
    contents: 0,
    publications: 0,
    clicks: 0,
    conversions: 0,
    commissions: 'R$ 0,00',
    revenue: 'R$ 0,00',
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats?t=' + Date.now());
      const data = await res.json();
      if (data.success && data.metrics) {
        setStats(data.metrics);
        if (data.recentLogs) {
          setRecentLogs(data.recentLogs);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar métricas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const triggerAutonomousAction = async (actionType: string) => {
    setRunningAction(actionType);
    setActionSuccess(null);
    try {
      if (actionType === 'DISCOVER') {
        const res = await fetch('/api/discovery/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: 'amazon-brasil',
            query: 'oferta',
            limit: 10
          })
        });
        const data = await res.json();
        if (data.success) {
          setActionSuccess(`Descoberta concluída! ${data.imported || 0} produtos importados/atualizados.`);
        }
      } else if (actionType === 'PUBLISH_QUEUE') {
        const res = await fetch('/api/n8n/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-n8n-api-key': 'n8n_secret_autopilot_key_2026'
          },
          body: JSON.stringify({
            event: 'PROCESS_PUBLISH_QUEUE'
          })
        });
        const data = await res.json();
        if (data.success) {
          setActionSuccess(`Fila de publicação processada com sucesso nos canais conectados!`);
        }
      } else if (actionType === 'AUTOPILOT_CYCLE') {
        const res = await fetch('/api/n8n/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-n8n-api-key': 'n8n_secret_autopilot_key_2026'
          },
          body: JSON.stringify({
            event: 'DISCOVER_DEALS',
            source: 'n8n-cron',
            payload: { autoPublish: true }
          })
        });
        const data = await res.json();
        if (data.success) {
          setActionSuccess(`Ciclo 100% autônomo executado com sucesso: Descoberta, geração de copy e disparo omnichannel finalizados!`);
        }
      }
      await fetchStats();
    } catch (e: any) {
      console.error(e);
      setActionSuccess(`Erro na ação: ${e.message}`);
    } finally {
      setRunningAction(null);
      setTimeout(() => setActionSuccess(null), 6000);
    }
  };

  const metrics: MetricItem[] = [
    {
      key: 'products',
      title: 'Produtos Monitorados',
      value: String(stats.products),
      icon: Package,
      emptyText: `${stats.products} produtos monitorados ativos no catálogo.`,
      href: '/discovery',
    },
    {
      key: 'offers',
      title: 'Ofertas Encontradas',
      value: String(stats.offers),
      icon: Tag,
      emptyText: `${stats.offers} oportunidades com alto score identificadas.`,
      href: '/opportunities',
    },
    {
      key: 'contents',
      title: 'Conteúdos Criados',
      value: String(stats.contents),
      icon: FileText,
      emptyText: `${stats.contents} pacotes de copy persuasivos gerados.`,
      href: '/content',
    },
    {
      key: 'publications',
      title: 'Publicações',
      value: String(stats.publications),
      icon: Share2,
      emptyText: `${stats.publications} postagens despachadas para redes sociais.`,
      href: '/publications',
    },
    {
      key: 'clicks',
      title: 'Cliques',
      value: String(stats.clicks),
      icon: MousePointerClick,
      emptyText: `${stats.clicks} cliques registrados em links afiliados.`,
      href: '/analytics',
    },
    {
      key: 'conversions',
      title: 'Conversões',
      value: String(stats.conversions),
      icon: ShoppingBag,
      emptyText: `${stats.conversions} vendas convertidas identificadas.`,
      href: '/analytics',
    },
    {
      key: 'commissions',
      title: 'Comissões',
      value: stats.commissions || 'R$ 0,00',
      icon: Coins,
      emptyText: 'Comissões totais calculadas.',
      href: '/business/executive',
    },
    {
      key: 'revenue',
      title: 'Receita Est. Total',
      value: stats.revenue || 'R$ 0,00',
      icon: DollarSign,
      emptyText: 'Volume total de vendas geradas.',
      href: '/business/executive',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Banner Informativo de Autonomia 100% com Ações Imediatas */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-gray-900 to-gray-900 border border-emerald-500/30 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-100">
                Operação 100% Autônoma (Piloto Automático Ativo)
              </h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                PRODUÇÃO VIVA
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-2xl">
              O ecossistema está operando de forma autônoma: Descoberta de ofertas, ranqueamento de oportunidades, geração de copy persuasiva e despacho multi-canal no Telegram, WhatsApp e todas as redes sociais configuradas 24/7.
            </p>
          </div>
        </div>

        {/* Botões de Ação Rápida no Banner */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => triggerAutonomousAction('AUTOPILOT_CYCLE')}
            disabled={runningAction !== null}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{runningAction === 'AUTOPILOT_CYCLE' ? 'Executando Ciclo...' : 'Disparar Ciclo Autônomo Agora'}</span>
          </button>

          <button
            onClick={() => triggerAutonomousAction('DISCOVER')}
            disabled={runningAction !== null}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-xs px-3.5 py-2.5 rounded-xl border border-gray-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${runningAction === 'DISCOVER' ? 'animate-spin' : ''}`} />
            <span>Buscar Ofertas</span>
          </button>

          <button
            onClick={() => triggerAutonomousAction('PUBLISH_QUEUE')}
            disabled={runningAction !== null}
            className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Despachar Fila</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 font-bold hover:underline ml-2">Fechar</button>
        </div>
      )}

      {/* Grid de Cards de Métricas com Links para as Seções */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Visão Geral da Operação
          </h3>
          <button
            onClick={fetchStats}
            className="text-xs text-gray-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Atualizar Dados</span>
          </button>
        </div>

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
                <Link
                  key={metric.key}
                  href={metric.href}
                  className="bg-gray-900/80 border border-gray-800 hover:border-emerald-500/40 hover:bg-gray-800/50 transition-all rounded-xl p-5 flex flex-col justify-between group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                      {metric.title}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 group-hover:border-emerald-500/30 flex items-center justify-center text-emerald-400 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-100 mb-2">{metric.value}</div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 group-hover:text-gray-400 transition-colors">
                    <p className="truncate mr-2">{metric.emptyText}</p>
                    <ExternalLink className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Atividades Recentes e Logs em Tempo Real */}
      <section className="mt-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Atividades Recentes do Autopilot
        </h3>
        {recentLogs.length > 0 ? (
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-lg divide-y divide-gray-800/60">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    log.level === 'ERROR' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {log.event || log.level}
                  </span>
                  <span className="text-gray-200 font-medium">{log.message}</span>
                </div>
                <span className="text-gray-500 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Piloto automático em standby aguardando próximo ciclo de cron"
            description="Você pode clicar no botão 'Disparar Ciclo Autônomo Agora' no topo para rodar o pipeline instantaneamente."
          />
        )}
      </section>
    </div>
  );
}
