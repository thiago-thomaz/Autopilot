'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export default function SettingsPage() {
  const [appName, setAppName] = useState('Affiliate Autopilot');
  const [currency, setCurrency] = useState('BRL');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [locale, setLocale] = useState('pt-BR');
  const [operationMode, setOperationMode] = useState<'MANUAL' | 'SEMI_AUTOMATICO' | 'AUTOMATICO'>('MANUAL');
  const [enableAutomation, setEnableAutomation] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setAppName(data.settings.appName || 'Affiliate Autopilot');
          setCurrency(data.settings.defaultCurrency || 'BRL');
          setTimezone(data.settings.defaultTimezone || 'America/Sao_Paulo');
          setLocale(data.settings.defaultLocale || 'pt-BR');
          setOperationMode(data.settings.operationMode || 'MANUAL');
          setEnableAutomation(data.settings.enableAutomation || false);
        }
      })
      .catch((err) => console.error('Erro ao carregar configurações:', err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          defaultCurrency: currency,
          defaultTimezone: timezone,
          defaultLocale: locale,
          operationMode,
          enableAutomation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-100">Configurações Gerais do Sistema</h1>
          <p className="text-xs text-gray-400">
            Parâmetros globais, modos de operação e controles de segurança da plataforma.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5" />
          <span>Configurações atualizadas e registradas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Bloco 1: Identificação e Localização */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Identificação & Região
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Nome da Operação
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Moeda Padrão
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Fuso Horário (Timezone)
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Idioma / Localização
              </label>
              <input
                type="text"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Modo de Operação & Automação */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Modo de Operação e Segurança</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Modo de Operação Selecionado
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { mode: 'MANUAL', title: 'MANUAL (Padrão)', desc: 'Todas as aprovações e ações dependem de ação do operador.' },
                  { mode: 'SEMI_AUTOMATICO', title: 'SEMI-AUTOMÁTICO', desc: 'Descoberta automática com aprovação prévia obrigatória.' },
                  { mode: 'AUTOMATICO', title: 'AUTOMÁTICO', desc: 'Execução autônoma sujeita a regras rígidas de compliance.' },
                ].map((item) => (
                  <label
                    key={item.mode}
                    onClick={() => setOperationMode(item.mode as any)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      operationMode === item.mode
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="font-bold text-xs mb-1">{item.title}</div>
                    <div className="text-[11px] leading-tight text-gray-400">{item.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-gray-200 block">
                  Habilitar Automação Global (<code className="text-amber-400 text-xs">ENABLE_AUTOMATION</code>)
                </span>
                <span className="text-xs text-gray-400 block mt-0.5">
                  No Módulo 1, esta chave deve permanecer desligada para segurança.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEnableAutomation(!enableAutomation)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableAutomation ? 'bg-emerald-500' : 'bg-gray-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableAutomation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Informação sobre N8N Webhook Key */}
        <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-400 leading-relaxed">
            <strong className="text-gray-200">Autenticação de Webhook n8n:</strong> O endpoint <code className="text-indigo-300">/api/n8n/events</code> exige o envio da chave via cabeçalho HTTP <code className="text-indigo-300">x-n8n-api-key</code> configurada na variável de ambiente <code className="text-indigo-300">N8N_API_KEY</code>.
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
