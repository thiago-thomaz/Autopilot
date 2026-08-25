'use client';

import { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, Plus, CheckCircle2, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [platform, setPlatform] = useState('TELEGRAM');
  const [accountName, setAccountName] = useState('');
  const [accountIdentifier, setAccountIdentifier] = useState('');
  const [country, setCountry] = useState('BR');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/publications/accounts');
      const data = await res.json();
      if (data.success) setAccounts(data.accounts || []);
    } catch (err) {
      console.error('Erro ao carregar contas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/publications/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          accountName,
          accountIdentifier: accountIdentifier || `${platform.toLowerCase()}_${Date.now()}`,
          country,
          status: 'ACTIVE'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Conta conectada com sucesso!');
        setShowAddForm(false);
        setAccountName('');
        setAccountIdentifier('');
        await loadAccounts();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <Link href="/publications" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Publicações</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Canais e Redes Sociais Conectadas</h1>
            <p className="text-xs text-gray-400">
              Gerenciamento de contas, grupos do Telegram, WhatsApp e todas as redes sociais omnichannel.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancelar' : 'Conectar Novo Canal'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddAccount} className="bg-gray-900/95 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4 text-xs animate-fadeIn">
          <h2 className="text-sm font-bold text-indigo-300">Adicionar Canal / Conta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Plataforma</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
              >
                <option value="TELEGRAM">Telegram (Canal / Grupo)</option>
                <option value="WHATSAPP">WhatsApp (Grupo / Comunidade)</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="TIKTOK">TikTok</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="PINTEREST">Pinterest</option>
                <option value="FACEBOOK_PAGES">Facebook Pages</option>
                <option value="DISCORD">Discord</option>
                <option value="REDDIT">Reddit</option>
                <option value="X">X (Twitter)</option>
                <option value="THREADS">Threads</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Nome de Exibição da Conta</label>
              <input
                type="text"
                placeholder="ex: Canal Promos Tech Brasil"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Identificador / Chat ID / Handle</label>
              <input
                type="text"
                placeholder="ex: -1004361711015 ou @canal"
                value={accountIdentifier}
                onChange={(e) => setAccountIdentifier(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Canal'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Canais Conectados ({accounts.length})</h2>

        {loading ? (
          <div className="text-gray-500">Carregando contas conectadas...</div>
        ) : accounts.length === 0 ? (
          <div className="text-gray-400 p-6 border border-dashed border-gray-800 rounded-xl text-center space-y-2">
            <p>O canal oficial do Telegram (`-1004361711015`) opera via credenciais globais ativas.</p>
            <p className="text-[11px] text-gray-500">Clique em &quot;Conectar Novo Canal&quot; acima para registrar canais adicionais segmentados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-gray-950 border border-gray-800 hover:border-gray-700 transition-all rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-200">{acc.accountName}</span>
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {acc.status}
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">Plataforma: {acc.platform} ({acc.country})</div>
                {acc.accountIdentifier && (
                  <div className="text-gray-400 font-mono text-[10px] bg-gray-900 px-2 py-1 rounded">
                    ID: {acc.accountIdentifier}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
