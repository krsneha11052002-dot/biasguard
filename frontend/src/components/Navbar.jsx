import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  BarChart3, 
  AlertTriangle, 
  Sliders, 
  Sparkles, 
  Award, 
  FileText, 
  PieChart as PieIcon,
  Cpu,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onStartDemo, hasAuditData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Cpu },
    { id: 'dashboard', label: 'Audit Dashboard', icon: LayoutDashboard },
    { id: 'fairness', label: 'Fairness Checks', icon: BarChart3 },
    { id: 'findings', label: 'Bias Findings', icon: AlertTriangle },
    { id: 'simulator', label: 'Mitigation Sim', icon: Sliders },
    { id: 'bounty', label: 'Bias Bounty', icon: Award },
    { id: 'report', label: 'Audit Report', icon: FileText },
    { id: 'stats', label: 'Stats / Analytics', icon: PieIcon },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-slate-800 no-print shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => handleTabClick('overview')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-teal to-brand-cyan flex items-center justify-center text-navy-950 shadow-lg shadow-brand-teal/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  BiasGuard <span className="text-brand-teal">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-brand-indigo/20 text-brand-cyan border border-brand-indigo/30">
                  Innov8 4.0
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">AI Bias Detection & Fairness Audit</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1 bg-navy-950/70 p-1 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'fairness' && activeTab === 'heatmap');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-md shadow-brand-teal/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'findings' && hasAuditData && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onStartDemo}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-indigo via-brand-purple to-pink-500 text-white shadow-lg shadow-brand-indigo/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="hidden sm:inline">Start Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Horizontal scrollbar for Medium Screens (Tablets / Laptops) */}
        <div className="hidden md:flex xl:hidden overflow-x-auto py-2 border-t border-slate-800/60 gap-1.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'fairness' && activeTab === 'heatmap');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu (Phones) */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1 animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'fairness' && activeTab === 'heatmap');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-blue to-brand-teal text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-brand-cyan" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="text-[10px] uppercase font-bold tracking-wider">Active</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
