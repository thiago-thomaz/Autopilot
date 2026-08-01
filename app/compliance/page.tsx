'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Info,
  ShieldAlert,
  Search,
  Plus
} from 'lucide-react';

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'blocklist' | 'disclosure'>('rules');

  const rules = [
    {
      id: 'rule_1',
      title: 'Amazon Associates Operating Agreement',
      category: 'Amazon Brasil',
      status: 'COMPLIANT',
      description: 'Inclusão obrigatória do aviso de afiliado em postagens com links diretos.',
      requirement: 'Este site inclui links de afiliados da Amazon. Podemos receber comissões pelas compras elegíveis.',
    },
    {
      id: 'rule_2',
      title: 'Regras de Marca & Logotipos',
      category: 'Mercado Livre & Amazon',
      status: 'COMPLIANT',
      description: 'Proibição de alteração ou distorção dos logotipos oficiais das plataformas de afiliados.',
      requirement: 'Usar apenas badges oficiais sem modificações visuais.',
    },
    {
      id: 'rule_3',
      title: 'Transparência de Preço & Desconto (CONAR / FTC)',
      category: 'Geral',
      status: 'COMPLIANT',
      description: 'Verificação contínua se o preço "De R$" corresponde ao histórico real de preço sem falsas promoções.',
      requirement: 'Desconto calculado estritamente com base nos últimos 30 dias.',
    },
  ];

  const blocklist = [
    { type: 'Palavra-chave', value: 'réplica', reason: 'Falsificação ou produto não oficial' },
    { type: 'Palavra-chave', value: 'pirata', reason: 'Violação de direitos autorais' },
    { type: 'Categoria', value: 'Medicamentos tarjados', reason: 'Restrição regulatória sanitária' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Central de Compliance & Segurança Legal</h1>
            <p className="text-xs text-gray-400">
              Gerenciamento de regras operacionais de afiliados, transparência, avisos obrigatórios e listas de bloqueio.
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold self-start md:self-auto">
          <CheckCircle2 className="w-4 h-4" /> Compliance Ativo (100% Protegido)
        </span>
      </div>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <span className="text-xs text-gray-400 font-medium">Regras de Parceiros</span>
          <div className="text-2xl font-extrabold text-emerald-400">3 Ativas</div>
          <p className="text-[11px] text-gray-500">Amazon Associates, Mercado Livre e CONAR</p>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <span className="text-xs text-gray-400 font-medium">Alertas de Marca</span>
          <div className="text-2xl font-extrabold text-gray-100">0 Incidentes</div>
          <p className="text-[11px] text-gray-500">Nenhum aviso de violação registrado</p>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-2 shadow-xl">
          <span className="text-xs text-gray-400 font-medium">Filtro de Blocklist</span>
          <div className="text-2xl font-extrabold text-indigo-400">{blocklist.length} Regras de Bloqueio</div>
          <p className="text-[11px] text-gray-500">Filtragem automática de termos proibidos</p>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'rules'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Regras de Programas de Afiliados
        </button>

        <button
          onClick={() => setActiveTab('blocklist')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'blocklist'
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Blocklist & Palavras Proibidas
        </button>

        <button
          onClick={() => setActiveTab('disclosure')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'disclosure'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Avisos Legais & Disclaimer (Disclosures)
        </button>
      </div>

      {/* Conteúdo Aba Regras */}
      {activeTab === 'rules' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {rules.map((r) => (
              <div key={r.id} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 text-xs font-semibold">
                      {r.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-100">{r.title}</h3>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                  </span>
                </div>
                <p className="text-xs text-gray-400">{r.description}</p>
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-gray-300">
                  <strong className="block text-[11px] uppercase text-gray-500 mb-1">Texto de Requisito Exigido:</strong>
                  <code>"{r.requirement}"</code>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Conteúdo Aba Blocklist */}
      {activeTab === 'blocklist' && (
        <section className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-100">Filtro de Termos e Categorias Bloqueadas</h3>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Regra</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase text-[11px]">
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Valor / Termo</th>
                  <th className="p-3">Motivo do Bloqueio</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {blocklist.map((b, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="p-3 text-gray-300 font-semibold">{b.type}</td>
                    <td className="p-3 font-mono text-rose-400 font-bold">{b.value}</td>
                    <td className="p-3 text-gray-400">{b.reason}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                        BLOQUEADO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Conteúdo Aba Disclosure */}
      {activeTab === 'disclosure' && (
        <section className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
          <h3 className="text-sm font-bold text-gray-100">Avisos de Afiliado Padrão para Postagens</h3>
          <p className="text-gray-400">
            Estes avisos são injetados automaticamente no final de cada publicação gerada pelo sistema para conformidade com as diretrizes do Programa de Afiliados.
          </p>

          <div className="space-y-3">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-1">
              <span className="font-bold text-emerald-400 block text-xs">Aviso Padrão Brasil (CONAR / Amazon BR)</span>
              <p className="text-gray-300 text-xs">
                "Como participante do Programa de Afiliados da Amazon e Mercado Livre, podemos receber comissões por compras qualificadas realizadas através dos nossos links, sem nenhum custo adicional para você."
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-1">
              <span className="font-bold text-indigo-400 block text-xs">Aviso Padrão Internacional (FTC Compliance)</span>
              <p className="text-gray-300 text-xs">
                "As an Amazon Associate I earn from qualifying purchases. Prices and availability subject to change."
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
