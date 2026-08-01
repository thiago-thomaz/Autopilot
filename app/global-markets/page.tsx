'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  Layers,
  Search,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Sliders,
  Scale
} from 'lucide-react';
import { MarketOpportunityResult, MarketSummary } from '@/types/global/global.types';

export default function GlobalMarketsDashboard() {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<MarketOpportunityResult[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const fetchGlobalData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/global/opportunities');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOpportunities(json.data);
      }
    } catch {
      // Mock fallback data
      setOpportunities([
        {
          productId: 'prod-001',
          country: 'US',
          language: 'en',
          currency: 'USD',
          channel: 'INSTAGRAM',
          opportunityScore: 92,
          expectedProfit: 45.0,
          expectedROI: 180.0,
          confidence: 0.85,
          riskScore: 15.0,
          localizationCost: 5.0,
          netMarketValue: 38.0,
          recommendation: 'EXPAND',
          status: 'ACTIVE'
        },
        {
          productId: 'prod-002',
          country: 'DE',
          language: 'de',
          currency: 'EUR',
          channel: 'BLOG',
          opportunityScore: 88,
          expectedProfit: 60.0,
          expectedROI: 210.0,
          confidence: 0.82,
          riskScore: 20.0,
          localizationCost: 6.0,
          netMarketValue: 51.0,
          recommendation: 'EXPAND',
          status: 'ACTIVE'
        },
        {
          productId: 'prod-003',
          country: 'UK',
          language: 'en',
          currency: 'GBP',
          channel: 'YOUTUBE',
          opportunityScore: 81,
          expectedProfit: 85.0,
          expectedROI: 250.0,
          confidence: 0.78,
          riskScore: 25.0,
          localizationCost: 5.0,
          netMarketValue: 74.0,
          recommendation: 'TEST',
          status: 'TESTING'
        },
        {
          productId: 'prod-004',
          country: 'BR',
          language: 'pt',
          currency: 'BRL',
          channel: 'WHATSAPP',
          opportunityScore: 79,
          expectedProfit: 30.0,
          expectedROI: 140.0,
          confidence: 0.75,
          riskScore: 35.0,
          localizationCost: 4.0,
          netMarketValue: 23.0,
          recommendation: 'TEST',
          status: 'ACTIVE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activeMarkets = [
    { code: 'US', name: 'United States', status: 'ACTIVE', flag: '🇺🇸', revenueUSD: 24500, netProfitUSD: 10200, roiPercent: 210 },
    { code: 'DE', name: 'Germany', status: 'ACTIVE', flag: '🇩🇪', revenueUSD: 12400, netProfitUSD: 4800, roiPercent: 195 },
    { code: 'UK', name: 'United Kingdom', status: 'TESTING', flag: '🇬🇧', revenueUSD: 6800, netProfitUSD: 2100, roiPercent: 175 },
    { code: 'BR', name: 'Brazil', status: 'ACTIVE', flag: '🇧🇷', revenueUSD: 4800, netProfitUSD: 1140, roiPercent: 150 },
    { code: 'JP', name: 'Japan', status: 'OPPORTUNITY', flag: '🇯🇵', revenueUSD: 0, netProfitUSD: 0, roiPercent: 0 }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-gray-100">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-gray-900 to-gray-900 border border-blue-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30 text-blue-400">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Global Market Expansion & Localization Engine
              </h1>
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/30">
                MÓDULO 10 — MULTI-MARKET
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Multi-market & multi-language expansion: Discovery, Legal Policies, FX Conversions, FTC/ASA Disclosures, and Net Market Value economics.
            </p>
          </div>
        </div>

        <button
          onClick={fetchGlobalData}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg hover:shadow-blue-500/25 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Scan Global Markets
        </button>
      </div>

      {/* Global Dashboard Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
          <span className="text-xs text-gray-400">Global Gross Revenue</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">$48,500.00</div>
          <p className="text-xs text-emerald-500 font-medium">Across 4 active markets</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
          <span className="text-xs text-gray-400">Global Net Profit</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">$18,240.00</div>
          <p className="text-xs text-gray-500">After localization & risk penalties</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
          <span className="text-xs text-gray-400">Global Average ROI</span>
          <div className="text-2xl font-bold font-mono text-purple-400">215.0%</div>
          <p className="text-xs text-gray-500">Yield across all international channels</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-2">
          <span className="text-xs text-gray-400">Active Markets</span>
          <div className="text-2xl font-bold font-mono text-blue-400">4 / 10</div>
          <p className="text-xs text-blue-400">US, DE, UK, BR (JP Testing)</p>
        </div>
      </div>

      {/* Interactive World Map / Market Status Cards */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              World Market Coverage & Status
            </h2>
            <p className="text-xs text-gray-400">Market availability, active test state, and performance breakdown</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {activeMarkets.map((m) => (
            <div
              key={m.code}
              onClick={() => setSelectedCountry(m.code)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedCountry === m.code
                  ? 'bg-blue-950/40 border-blue-500 shadow-lg'
                  : 'bg-gray-950/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{m.flag}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    m.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : m.status === 'TESTING'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <div className="mt-3 font-bold text-sm text-white">{m.name}</div>
              <div className="text-xs text-gray-400 font-mono mt-1">Code: {m.code}</div>
              {m.revenueUSD > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Revenue:</span>
                    <span className="text-emerald-400 font-mono">${m.revenueUSD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Profit:</span>
                    <span className="text-emerald-400 font-mono">${m.netProfitUSD.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side Market Comparison Matrix */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Side-by-Side Market Comparison Matrix
            </h2>
            <p className="text-xs text-gray-400">Comparing Net Value economics, localization costs, and regulatory rules</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Market Metric</th>
                <th className="py-3 px-4 text-center">🇺🇸 US (United States)</th>
                <th className="py-3 px-4 text-center">🇩🇪 DE (Germany)</th>
                <th className="py-3 px-4 text-center">🇬🇧 UK (United Kingdom)</th>
                <th className="py-3 px-4 text-center">🇧🇷 BR (Brazil)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-xs">
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-300">Currency & FX Base</td>
                <td className="py-3 px-4 text-center font-mono">USD ($)</td>
                <td className="py-3 px-4 text-center font-mono">EUR (€)</td>
                <td className="py-3 px-4 text-center font-mono">GBP (£)</td>
                <td className="py-3 px-4 text-center font-mono">BRL (R$)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-300">Avg Localization Cost</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-400">$2.50</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-400">$6.00</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-400">$3.00</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-400">$4.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-300">Regulatory Framework</td>
                <td className="py-3 px-4 text-center text-gray-400">FTC 16 CFR § 255</td>
                <td className="py-3 px-4 text-center text-gray-400">UWG & GDPR</td>
                <td className="py-3 px-4 text-center text-gray-400">ASA CAP Code</td>
                <td className="py-3 px-4 text-center text-gray-400">CONAR & LGPD</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-300">Risk Penalty Score</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-400">15.0 (LOW)</td>
                <td className="py-3 px-4 text-center font-mono text-amber-400">20.0 (MEDIUM)</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-400">18.0 (LOW)</td>
                <td className="py-3 px-4 text-center font-mono text-amber-400">35.0 (MEDIUM)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-gray-300">Top Distribution Channel</td>
                <td className="py-3 px-4 text-center text-blue-400">Instagram / TikTok</td>
                <td className="py-3 px-4 text-center text-blue-400">Blog / YouTube</td>
                <td className="py-3 px-4 text-center text-blue-400">YouTube / Instagram</td>
                <td className="py-3 px-4 text-center text-blue-400">WhatsApp / Instagram</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Opportunities Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Global Expansion Opportunities
            </h2>
            <p className="text-xs text-gray-400">Evaluated combinations of Product x Country x Language x Channel</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Target Market</th>
                <th className="py-3 px-4">Language & Currency</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Expected Profit</th>
                <th className="py-3 px-4">Net Market Value</th>
                <th className="py-3 px-4">Recommendation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-xs">
              {opportunities.map((opp, i) => (
                <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-4 px-4 font-mono font-medium text-gray-200">{opp.productId}</td>
                  <td className="py-4 px-4 font-semibold text-white">
                    {opp.country === 'US' ? '🇺🇸 US' : opp.country === 'DE' ? '🇩🇪 DE' : opp.country === 'UK' ? '🇬🇧 UK' : '🇧🇷 BR'}
                  </td>
                  <td className="py-4 px-4 text-gray-400 font-mono">
                    {opp.language.toUpperCase()} / {opp.currency}
                  </td>
                  <td className="py-4 px-4 text-blue-400 font-medium">{opp.channel}</td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400">${opp.expectedProfit.toFixed(2)}</td>
                  <td className="py-4 px-4 font-mono font-bold text-purple-300">${opp.netMarketValue.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">
                      {opp.recommendation}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Localize Package
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
