'use client';

import React from 'react';
import { Brain, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  totalKnowledge: number;
  accuracyScore: number;
  decayRate: number;
  learningLatencyMs: number;
}

export function LearningMetricsCard({
  totalKnowledge = 42,
  accuracyScore = 94.2,
  decayRate = 0.01,
  learningLatencyMs = 124
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Total Knowledge Items</span>
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
            <Brain className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{totalKnowledge}</div>
        <p className="text-xs text-emerald-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> +12% this week
        </p>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Knowledge Accuracy</span>
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{accuracyScore}%</div>
        <p className="text-xs text-blue-400 flex items-center gap-1">
          Verified against M13 outcomes
        </p>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Avg Decay Rate</span>
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
            <TrendingUp className="w-5 h-5 rotate-180" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{(decayRate * 100).toFixed(2)}% / day</div>
        <p className="text-xs text-amber-400 flex items-center gap-1">
          Temporal confidence decay
        </p>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Learning Latency</span>
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{learningLatencyMs} ms</div>
        <p className="text-xs text-purple-400 flex items-center gap-1">
          Near-real-time ingestion
        </p>
      </div>
    </div>
  );
}
