'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  FileText,
  Megaphone,
  Share2,
  Tv,
  Users,
  BarChart3,
  ShieldCheck,
  Zap,
  Terminal,
  Settings,
  Bot,
  Globe,
  Sparkles,
  Briefcase,
  Brain,
  GraduationCap
} from 'lucide-react';


const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Continuous Learning', href: '/learning', icon: GraduationCap },
  { name: 'Intelligence Layer', href: '/intelligence', icon: Brain },
  { name: 'Business OS', href: '/business/executive', icon: Briefcase },
  { name: 'Growth Engine', href: '/growth', icon: Sparkles },
  { name: 'Produtos', href: '/discovery', icon: Package },
  { name: 'Ofertas', href: '/opportunities', icon: Tag },
  { name: 'Conteúdos', href: '/content', icon: FileText },
  { name: 'Campanhas', href: '/growth/campaigns', icon: Megaphone },
  { name: 'Publicações', href: '/publications', icon: Share2 },
  { name: 'Canais', href: '/publications/accounts', icon: Tv },
  { name: 'Afiliados', href: '/afiliados', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Predictive Intelligence', href: '/ai', icon: Bot },
  { name: 'Global Markets', href: '/global-markets', icon: Globe },
  { name: 'Decision Engine', href: '/automation', icon: Zap },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheck },
  { name: 'Automações', href: '/automation', icon: Zap },
  { name: 'Logs', href: '/logs', icon: Terminal },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-gray-100 tracking-wide">Affiliate Autopilot</h1>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            Módulo 1
          </span>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-gray-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-800 bg-gray-950/40">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Modo de Operação:</span>
          <span className="font-mono text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
            MANUAL
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>Automação:</span>
          <span className="font-mono text-amber-400 font-semibold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
            OFF
          </span>
        </div>
      </div>
    </aside>
  );
}
