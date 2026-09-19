import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  BarChart3, 
  AlertTriangle, 
  Sliders, 
  Sparkles, 
  Award, 
  FileText, 
  PlayCircle,
  Cpu
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onStartDemo, hasAuditData }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Cpu },
    { id: 'dashboard', label: 'Audit Dashboard', icon: LayoutDashboard },
    { id: 'heatmap', label: 'Fairness Charts', icon: BarChart3, disabled: !hasAuditData },
    { id: 'findings', label: 'Bias Findings', icon: AlertTriangle, disabled: !hasAuditData },
    { id: 'simulator', label: 'Mitigation Sim', icon: Sliders, disabled: !hasAuditData },
    { id: 'bounty', label: 'Bias Bounty', icon: Award },
    { id: 'report', label: 'Audit Report', icon: FileText, disabled: !hasAuditData },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy-900/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('overview')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-teal to-brand-cyan flex items-center justify-center text-navy-950 shadow-lg shadow-brand-teal/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  BiasGuard <span className="text-brand-teal">AI</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-brand-indigo/20 text-brand-cyan border border-brand-indigo/30">
                  Innov8 4.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">AI Bias Detection & Fairness Audit</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-navy-950/60 p-1 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  disabled={item.disabled}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-md shadow-brand-teal/20'
                      : item.disabled
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
                  {item.label}
                  {item.id === 'findings' && hasAuditData && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onStartDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-indigo via-brand-purple to-pink-500 text-white shadow-lg shadow-brand-indigo/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Start Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
