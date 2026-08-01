'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  Info,
  Key,
  ShieldAlert,
  ShoppingBag
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  slug: string;
  website?: string;
  documentationUrl?: string;
  capabilities: {
    apiAvailable: boolean;
    linkGenerationAvailable: boolean;
    productDiscoveryAvailable: boolean;
    metricsAvailable: boolean;
    manualLinkGenerationOnly?: boolean;
  };
}

interface Account {
  id: string;
  accountName: string;
  externalAccountId?: string;
  status: string;
  environment: string;
  lastConnectionTest?: string;
  lastConnectionStatus?: string;
  lastError?: string;
  affiliatePlatform: Platform;
  credentialsConfigured: boolean;
}

export default function AfiliadosPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [accountName, setAccountName] = useState('');
  const [partnerTag, setPartnerTag] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialSecret, setCredentialSecret] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resPlatforms, resAccounts] = await Promise.all([
        fetch('/api/affiliate-platforms').then((r) => r.json()),
        fetch('/api/affiliate-accounts').then((r) => r.json()),
      ]);

      if (resPlatforms.success) setPlatforms(resPlatforms.platforms || []);
      if (resAccounts.success) setAccounts(resAccounts.accounts || []);
    } catch (err) {
      console.error('Erro ao carregar dados de afiliados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTestConnection = async (accountId: string) => {
    setTestingId(accountId);
    try {
      const res = await fetch(`/api/affiliate-accounts/${accountId}/test`, {
        method: 'POST',
      });
      const data = await res.json();
      await loadData();
    } catch (err) {
      console.error('Erro ao testar conexão:', err);
    } finally {
      setTestingId(null);
    }
  };

  const handleOpenConfigModal = (platform: Platform) => {
    setSelectedPlatform(platform);
    setAccountName(`Conta ${platform.name}`);
    setPartnerTag('');
    setCredentialId('');
    setCredentialSecret('');
    setModalOpen(true);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform) return;
    setSaving(true);

    const credentials: Record<string, string> = {};
    if (partnerTag) credentials.partnerTag = partnerTag;
    if (credentialId) credentials.credentialId = credentialId;
    if (credentialSecret) credentials.credentialSecret = credentialSecret;
    if (selectedPlatform.slug === 'mercado-livre') credentials.affiliateTag = partnerTag || 'ml_tag';

    try {
      const res = await fetch('/api/affiliate-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliatePlatformId: selectedPlatform.id,
          accountName,
          credentials,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        await loadData();
      }
    } catch (err) {
      console.error('Erro ao salvar conta:', err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
          </span>
        );
      case 'MANUAL_REQUIRED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Info className="w-3.5 h-3.5" /> Ação Manual Necessária
          </span>
        );
      case 'CONNECTION_ERROR':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" /> Erro de Conexão
          </span>
        );
      case 'CONFIGURED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Configurado
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700 text-xs font-semibold">
            Não Configurado
          </span>
        );
    }
  };

  // Métricas do Topo
  const connectedCount = accounts.filter((a) => a.status === 'CONNECTED' || a.status === 'MANUAL_REQUIRED').length;
  const configuredCount = accounts.length;
  const errorCount = accounts.filter((a) => a.status === 'CONNECTION_ERROR').length;
  const lastTestedAccount = accounts
    .filter((a) => a.lastConnectionTest)
    .sort((a, b) => new Date(b.lastConnectionTest!).getTime() - new Date(a.lastConnectionTest!).getTime())[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header da Central */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Central de Afiliados e Integrações</h1>
            <p className="text-xs text-gray-400">
              Administre suas contas parceiras em múltiplas plataformas de afiliados com abóboda de credenciais segura.
            </p>
          </div>
        </div>

        <button
          onClick={() => loadData()}
          className="flex items-center gap-2 text-xs font-medium text-gray-300 bg-gray-900 border border-gray-800 hover:border-gray-700 px-3.5 py-2 rounded-lg transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Status</span>
        </button>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-medium">Plataformas Conectadas</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{connectedCount}</div>
          <span className="text-[11px] text-gray-500 mt-1">Prontas para geração / coleta</span>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-medium">Contas Configuradas</span>
          <div className="text-2xl font-bold text-gray-100 mt-2">{configuredCount}</div>
          <span className="text-[11px] text-gray-500 mt-1">Cadastradas no sistema</span>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-medium">Integrações com Erro</span>
          <div className={`text-2xl font-bold mt-2 ${errorCount > 0 ? 'text-rose-400' : 'text-gray-400'}`}>
            {errorCount}
          </div>
          <span className="text-[11px] text-gray-500 mt-1">Requerem ajuste de credencial</span>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-medium">Último Teste de Conexão</span>
          <div className="text-sm font-semibold text-gray-200 mt-2">
            {lastTestedAccount?.lastConnectionTest
              ? new Date(lastTestedAccount.lastConnectionTest).toLocaleTimeString('pt-BR')
              : 'Nenhum executado'}
          </div>
          <span className="text-[11px] text-gray-500 mt-1">
            {lastTestedAccount ? `Conta: ${lastTestedAccount.accountName}` : 'Aguardando teste'}
          </span>
        </div>
      </div>

      {/* Grid de Plataformas Principais */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Plataformas de Afiliados Suportadas (Módulo 2)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => {
            const platformAccounts = accounts.filter((a) => a.affiliatePlatform.slug === platform.slug);
            const isML = platform.slug === 'mercado-livre';

            return (
              <div
                key={platform.id}
                className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-gray-700 transition-all shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-lg font-bold text-gray-200">
                        {isML ? '🟨 ML' : '📦 AMZ'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-100">{platform.name}</h3>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          {platform.website && (
                            <a
                              href={platform.website}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-emerald-400 flex items-center gap-1"
                            >
                              <span>{platform.website}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenConfigModal(platform)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Configurar Conta</span>
                    </button>
                  </div>

                  {/* Badges de Capabilities */}
                  <div className="flex flex-wrap gap-2 text-[11px] mb-4">
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        platform.capabilities.apiAvailable
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                          : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                      }`}
                    >
                      {platform.capabilities.apiAvailable ? 'API Oficial Disponível' : 'Geração Manual (Sem Scraping)'}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                      Geração de Links: {platform.capabilities.linkGenerationAvailable ? 'Sim' : 'Não'}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                      Busca de Produtos: {platform.capabilities.productDiscoveryAvailable ? 'API Nativa' : 'Manual'}
                    </span>
                  </div>

                  {/* Aviso do Mercado Livre */}
                  {isML && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200 leading-relaxed mb-4">
                      <strong className="block font-semibold mb-0.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-400" /> Ação Manual Necessária (Mercado Livre)
                      </strong>
                      Esta operação requer geração através das ferramentas oficiais do Programa de Afiliados do Mercado Livre. Cole o link oficial no sistema.
                    </div>
                  )}

                  {/* Lista de Contas Cadastradas */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400">Contas Registradas ({platformAccounts.length})</h4>
                    {platformAccounts.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">Nenhuma conta cadastrada para esta plataforma.</p>
                    ) : (
                      platformAccounts.map((acc) => (
                        <div
                          key={acc.id}
                          className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-3.5 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-gray-200 flex items-center gap-2">
                              <span>{acc.accountName}</span>
                              {acc.credentialsConfigured && (
                                <span className="text-[10px] bg-gray-800 text-emerald-400 px-1.5 py-0.5 rounded border border-gray-700 flex items-center gap-1">
                                  <Key className="w-2.5 h-2.5" /> Credenciais Criptografadas
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1">
                              Status: {acc.lastConnectionStatus || 'Não testado'}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {getStatusBadge(acc.status)}

                            <button
                              onClick={() => handleTestConnection(acc.id)}
                              disabled={testingId === acc.id}
                              className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-2.5 py-1.5 rounded-lg border border-gray-700 transition-all font-medium flex items-center gap-1 disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3 h-3 ${testingId === acc.id ? 'animate-spin' : ''}`} />
                              <span>{testingId === acc.id ? 'Testando...' : 'Testar Conexão'}</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal Seguro de Configuração de Conta */}
      {modalOpen && selectedPlatform && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-gray-100">
                Configurar Conta — {selectedPlatform.name}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-200 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-medium mb-1">Nome da Conta / Identificador Interno</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-emerald-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 font-medium mb-1">
                  Tag / ID de Afiliado (Associates / Partner Tag)
                </label>
                <input
                  type="text"
                  placeholder="ex: seustagafiliado-20"
                  value={partnerTag}
                  onChange={(e) => setPartnerTag(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-emerald-500 text-sm"
                  required
                />
              </div>

              {selectedPlatform.slug === 'amazon-brasil' && (
                <>
                  <div>
                    <label className="block text-gray-400 font-medium mb-1">Amazon Credential ID (API Key)</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-medium mb-1">Amazon Credential Secret</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={credentialSecret}
                      onChange={(e) => setCredentialSecret(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                    />
                  </div>
                </>
              )}

              <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 text-[11px] text-gray-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  As credenciais são salvas criptografadas com chave AES-256 no servidor (<code className="text-emerald-300">CredentialVault</code>) e nunca são expostas na interface.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Conta Criptografada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
