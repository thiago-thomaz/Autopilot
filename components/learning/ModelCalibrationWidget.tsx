'use client';

import React from 'react';
import { ModelCalibrationRecord } from '../../types/learning/learning.types';
import { Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  records: ModelCalibrationRecord[];
  onTriggerCalibration?: () => void;
}

export function ModelCalibrationWidget({ records = [], onTriggerCalibration }: Props) {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" /> Model & Agent Weight Calibrations (M9 / M13)
          </h2>
          <p className="text-sm text-gray-400">
            Real-time bias correction factors and agent consensus weights published by M14.
          </p>
        </div>

        {onTriggerCalibration && (
          <button
            onClick={onTriggerCalibration}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Trigger Calibration Cycle
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-gray-800/60 text-gray-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Target Module</th>
              <th className="py-2.5 px-3">Model / Component ID</th>
              <th className="py-2.5 px-3">Previous Metric</th>
              <th className="py-2.5 px-3">Calibrated Metric</th>
              <th className="py-2.5 px-3">Adjustment Factor</th>
              <th className="py-2.5 px-3">Reason</th>
              <th className="py-2.5 px-3">Applied At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No model calibration records logged yet.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-800/40">
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.targetModule === 'M9' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {r.targetModule}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">{r.modelId}</td>
                  <td className="py-3 px-3">{r.previousMetric}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{r.calibratedMetric}</td>
                  <td className="py-3 px-3 font-mono text-purple-300">{r.adjustmentFactor}x</td>
                  <td className="py-3 px-3 text-gray-400 max-w-xs truncate">{r.reason}</td>
                  <td className="py-3 px-3 text-gray-500">
                    {new Date(r.appliedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
