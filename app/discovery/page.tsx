'use client';

import { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  Plus,
  Package,
  ExternalLink,
  Tag,
  Star,
  DollarSign,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  FilePlus
} from 'lucide-react';
import Link from 'next/link';

export default function DiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');
  const [platform, setPlatform] = useState('amazon-brasil');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form de Importação Manual
  const [manualPlatform, setManualPlatform] = useState('mercado-livre');
  const [manualTitle, setManualTitle] = useState('');
  const [manualExternalId, setManualExternalId] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualPrevPrice, setManualPrevPrice] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products?limit=30');
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setSearching(true);
    setResult(null);

    try {
      const res = await fetch('/api/discovery/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          query,
          category: category || undefined,
          brand: brand || undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          limit: 10,
        }),
      });

      const data = await res.json();
      setResult(data);
      if (data.success) {
        await loadProducts();
      }
    } catch (err) {
      console.error('Erro na busca:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleManualImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImporting(true);
    setImportSuccess(false);

    try {
      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliatePlatformId: manualPlatform,
          externalId: manualExternalId || `ml_${Date.now()}`,
          title: manualTitle,
          productUrl: manualUrl,
          currentPrice: parseFloat(manualPrice),
          previousPrice: manualPrevPrice ? parseFloat(manualPrevPrice) : undefined,
          category: manualCategory || 'Geral',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setImportSuccess(true);
        setManualTitle('');
        setManualExternalId('');
        setManualUrl('');
        setManualPrice('');
        setManualPrevPrice('');
        await loadProducts();
        setTimeout(() => setImportSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Erro ao importar:', err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">Product Discovery Engine</h1>
            <p className="text-xs text-gray-400">
              Descoberta, busca autorizada via API e importação manual de ofertas com histórico de preço e atômico upsert.
            </p>
          </div>
        </div>

        <Link
          href="/discovery/queries"
          className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-lg transition-all"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Consultas Salvas</span>
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'search'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Busca via API (Amazon / MOCK)</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'manual'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FilePlus className="w-3.5 h-3.5" />
          <span>Importação Manual (Mercado Livre)</span>
        </button>
      </div>

      {/* Conteúdo Tab Busca */}
      {activeTab === 'search' && (
        <section className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Plataforma</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="amazon-brasil">Amazon Brasil (Creators API / MOCK)</option>
                  <option value="mercado-livre">Mercado Livre (Modo Manual)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 mb-1">Termo de Busca / Palavra-chave</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="ex: Kindle Paperwhite, Monitor Gamer 144Hz, SSD NVMe..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={searching}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{searching ? 'Buscando...' : 'Buscar'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">Categoria (Opcional)</label>
                <input
                  type="text"
                  placeholder="Eletrônicos"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Marca (Opcional)</label>
                <input
                  type="text"
                  placeholder="Amazon, Dell..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Preço Mínimo (R$)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Preço Máximo (R$)</label>
                <input
                  type="number"
                  placeholder="5000.00"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-gray-200"
                />
              </div>
            </div>
          </form>

          {/* Resultado do Resumo da Busca */}
          {result && (
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Descoberta Executada com Sucesso
                </span>
                <span className="text-gray-400">Tempo: {result.executionTimeMs}ms</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-gray-800 text-center">
                <div className="bg-gray-900 p-2 rounded">
                  <span className="block text-[10px] text-gray-500">Encontrados</span>
                  <span className="font-bold text-gray-200">{result.totalFound}</span>
                </div>
                <div className="bg-gray-900 p-2 rounded">
                  <span className="block text-[10px] text-gray-500">Importados</span>
                  <span className="font-bold text-emerald-400">{result.imported}</span>
                </div>
                <div className="bg-gray-900 p-2 rounded">
                  <span className="block text-[10px] text-gray-500">Atualizados</span>
                  <span className="font-bold text-indigo-400">{result.updated}</span>
                </div>
                <div className="bg-gray-900 p-2 rounded">
                  <span className="block text-[10px] text-gray-500">Duplicatas</span>
                  <span className="font-bold text-amber-400">{result.duplicates}</span>
                </div>
                <div className="bg-gray-900 p-2 rounded">
                  <span className="block text-[10px] text-gray-500">Rejeitados</span>
                  <span className="font-bold text-rose-400">{result.rejected}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Conteúdo Tab Importação Manual */}
      {activeTab === 'manual' && (
        <section className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Modo Manual (Mercado Livre):</strong> Sem scraping e sem automação não autorizada. Cole os dados oficiais da oferta encontrada para gravação atômica no banco de dados.
            </span>
          </div>

          {importSuccess && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 text-xs font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Produto importado manualmente com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleManualImport} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Título do Produto *</label>
                <input
                  type="text"
                  placeholder="ex: Smartphone Samsung Galaxy A55 128GB"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">ID Externo / Código do Produto *</label>
                <input
                  type="text"
                  placeholder="ex: MLB3849102"
                  value={manualExternalId}
                  onChange={(e) => setManualExternalId(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">URL Original do Produto *</label>
                <input
                  type="url"
                  placeholder="https://www.mercadolivre.com.br/p/MLB3849102"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Preço Atual (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1899.00"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Preço Anterior (De R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="2299.00"
                  value={manualPrevPrice}
                  onChange={(e) => setManualPrevPrice(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Categoria</label>
                <input
                  type="text"
                  placeholder="Smartphones"
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-200"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={importing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{importing ? 'Importando...' : 'Salvar Produto Manualmente'}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Tabela de Produtos Monitorados */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Produtos Monitorados no Banco ({products.length})
        </h2>

        {loadingProducts ? (
          <div className="text-xs text-gray-500">Carregando produtos...</div>
        ) : products.length === 0 ? (
          <div className="bg-gray-900/40 border border-dashed border-gray-800 rounded-xl p-8 text-center text-xs text-gray-400">
            Nenhum produto cadastrado ainda. Realize uma busca acima ou insira manualmente.
          </div>
        ) : (
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
                    <th className="p-3.5">Produto</th>
                    <th className="p-3.5">Plataforma / ID</th>
                    <th className="p-3.5">Preço Atual</th>
                    <th className="p-3.5">Score Oportunidade</th>
                    <th className="p-3.5">Origem</th>
                    <th className="p-3.5">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-gray-200 truncate">{p.title}</div>
                        <div className="text-[11px] text-gray-500 truncate">{p.category || 'Geral'}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono bg-gray-950 text-gray-300 px-2 py-0.5 rounded border border-gray-800">
                          {p.externalId}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400">
                        R$ {p.currentPrice.toFixed(2)}
                        {p.previousPrice && (
                          <span className="block text-[10px] text-gray-500 line-through">
                            R$ {p.previousPrice.toFixed(2)}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          {p.opportunityScore?.toFixed(1) || '0.0'} pts
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 text-[10px]">
                          {p.sourceType || 'API'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <Link
                          href={`/products/${p.id}`}
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          <span>Detalhes</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
