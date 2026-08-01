'use client';

import { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, Plus, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
            <h1 className="text-xl font-bold text-gray-100">Contas de Publicação Conectadas</h1>
            <p className="text-xs text-gray-400">
              Gerenciamento de conexões OAuth 2.0, chaves API por país e status de saúde.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Contas Ativas ({accounts.length})</h2>

        {loading ? (
          <div className="text-gray-500">Carregando contas conectadas...</div>
        ) : accounts.length === 0 ? (
          <div className="text-gray-400 p-4 border border-dashed border-gray-800 rounded-xl text-center">
            Nenhuma conta de publicação configurada ainda. As publicações utilizarão o modo MOCK seguro por padrão.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-200">{acc.accountName}</span>
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {acc.status}
                  </span>
                </div>
                <div className="text-gray-500 text-[11px]">Plataforma: {acc.platform} ({acc.country})</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
