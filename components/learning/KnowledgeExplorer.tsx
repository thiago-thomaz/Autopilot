'use client';

import React, { useState } from 'react';
import { DiscoveredKnowledge } from '../../types/learning/learning.types';
import { BookOpen, CheckCircle, AlertTriangle, History, Search } from 'lucide-react';

interface Props {
  items: DiscoveredKnowledge[];
}

export function KnowledgeExplorer({ items = [] }: Props) {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = items.filter((item) => {
    if (selectedType !== 'ALL' && item.knowledgeType !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" /> Discovered Enterprise Knowledge Base
          </h2>
          <p className="text-sm text-gray-400">
            Validated patterns, deterministic rules, and playbooks extracted from campaign & decision outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-1.5 w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 border-b border-gray-800">
        {['ALL', 'PATTERN', 'RULE', 'STRATEGY', 'PLAYBOOK', 'RISK', 'INSIGHT'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === type
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Knowledge Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          No knowledge items found matching the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/40 border border-gray-750 hover:border-emerald-500/40 rounded-xl p-5 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.knowledgeType}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <History className="w-3.5 h-3.5" /> v{item.version}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-gray-300 mb-4 line-clamp-2">{item.description}</p>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800/80 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Confidence</span>
                  <span className="font-bold text-emerald-400">{item.confidence}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Importance</span>
                  <span className="font-bold text-blue-400">{item.importance}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Status</span>
                  <span className="font-bold text-gray-300 flex items-center gap-1">
                    {item.status === 'VALIDATED' ? (
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                    )}
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
