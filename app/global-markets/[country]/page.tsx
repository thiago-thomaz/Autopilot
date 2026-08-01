'use client';

import { useState, useEffect } from 'react';
import { Globe, ShieldCheck, TrendingUp, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CountryDetailPage({ params }: { params: { country: string } }) {
  const country = params.country.toUpperCase();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-gray-100">
      <Link href="/global-markets" className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Global Markets
      </Link>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl">
            {country === 'US' ? '🇺🇸' : country === 'DE' ? '🇩🇪' : country === 'UK' ? '🇬🇧' : country === 'BR' ? '🇧🇷' : '🌐'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Market Detail: {country}</h1>
            <p className="text-xs text-gray-400">Deep-dive regulatory policies, preferred channels, and localized affiliate metrics</p>
          </div>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-500/20">
          STATUS: ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-white text-sm">Consumer & Market Maturity</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Ecommerce Maturity: <span className="text-emerald-400 font-bold">92%</span></div>
            <div>Price Sensitivity: <span className="text-amber-400 font-bold">MEDIUM</span></div>
            <div>Preferred Payment: Credit Card, PayPal</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-white text-sm">Regulatory Compliance</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Framework: <span className="text-blue-400 font-bold">FTC / GDPR Compliant</span></div>
            <div>Affiliate Disclosure: <span className="text-emerald-400 font-bold">MANDATORY</span></div>
            <div>Opt-In Required: Yes</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-white text-sm">Top Channels</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Primary: Instagram, TikTok</div>
            <div>Secondary: YouTube Shorts, Blog</div>
            <div>Conversion Benchmark CVR: <span className="text-purple-400 font-bold">3.8%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
