'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CopilotPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'COPILOT',
      text: 'Olá! Sou o Copiloto Executivo C-Suite do Affiliate Autopilot. Todos os dados financeiros e diagnósticos apresentados são agregados diretamente do banco PostgreSQL sem alucinações de LLM. Como posso ajudar com a estratégia do negócio hoje?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = { sender: 'USER', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/business/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'COPILOT', text: data.answer || 'Diagnóstico executivo processado.' }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { sender: 'COPILOT', text: 'Erro ao processar consulta do Copiloto.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 space-y-8 flex flex-col">
      <div className="border-b border-gray-800 pb-6 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-emerald-400" />
          Copiloto Executivo & Diagnóstico C-Suite
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Assistente de inteligência executiva com dados financeiros em tempo real e verificação anti-alucinação.
        </p>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl text-xs max-w-2xl ${
                m.sender === 'USER'
                  ? 'bg-emerald-600 text-white ml-auto font-medium'
                  : 'bg-gray-950/80 border border-gray-800 text-gray-200 leading-relaxed'
              }`}
            >
              <div className="font-bold mb-1 text-[10px] uppercase opacity-70">
                {m.sender === 'USER' ? 'Você (Operador)' : 'Copiloto Executivo C-Suite'}
              </div>
              <p>{m.text}</p>
            </div>
          ))}
          {loading && (
            <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 text-gray-400 text-xs animate-pulse">
              Consultando banco de dados PostgreSQL e calculando DRE Executivo...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-800 shrink-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte ao Copiloto Executivo (ex: Qual o nosso Lucro Líquido e margem atual?)"
            className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow"
          >
            <Send className="w-4 h-4" /> Perguntar
          </button>
        </div>
      </div>
    </div>
  );
}
