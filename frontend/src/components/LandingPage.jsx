import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Scale, 
  Lightbulb, 
  ArrowRight, 
  Database, 
  Sparkles, 
  Download,
  FileCheck2, 
  AlertOctagon, 
  BarChart2, 
  Zap,
  Users2
} from 'lucide-react';

export default function LandingPage({ onStartAudit, onLoadDemo, onStartDemo }) {
  const handleDownloadSampleCSV = () => {
    const link = document.createElement('a');
    link.href = '/biasguard_test_dataset.csv';
    link.download = 'biasguard_test_dataset.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Glow background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-brand-indigo/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-medium mb-8 backdrop-blur-sm shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-brand-teal animate-ping" />
            <span className="text-brand-cyan font-semibold">Hackathon Edition</span>
            <span className="text-slate-500">•</span>
            <span>Innov8 4.0 — The Bias Bounty</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              BiasGuard AI
            </span>
            <br />
            <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-brand-cyan via-brand-teal to-brand-indigo bg-clip-text text-transparent">
              AI Bias Detection & Fairness Audit Platform
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            <span className="font-semibold text-white">Find hidden bias. Measure fairness. Build better AI.</span>
            <br />
            <span className="text-slate-400 text-base mt-2 block">
              Identify unequal algorithmic outcomes across demographic groups, calculate mathematical fairness metrics, and generate actionable responsible AI reports.
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartAudit}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-xl shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Start Bias Audit</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onLoadDemo}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700/80 hover:border-slate-600 hover:text-white transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Try Demo Dataset</span>
            </button>

            <button
              onClick={handleDownloadSampleCSV}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-brand-cyan hover:text-white bg-slate-900/60 border border-brand-teal/30 hover:border-brand-teal/60 transition-all"
            >
              <Download className="w-4 h-4 text-brand-teal" />
              <span>Download Sample CSV</span>
            </button>
          </div>
        </div>
      </section>

      {/* Explanatory Banner Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-brand-teal/20 relative overflow-hidden bg-gradient-to-r from-navy-900/90 via-navy-850 to-navy-900/90">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-brand-teal/10 text-brand-cyan border border-brand-teal/20 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1.5">
                  Responsible AI Audit & Governance Engine
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  "BiasGuard AI helps teams identify unequal AI outcomes across demographic or user groups and provides an interpretable fairness audit."
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Zero API Keys Required
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-indigo/10 text-brand-cyan border border-brand-indigo/20">
                Instant Local Engine
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Short Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Core Fairness Auditing Capabilities
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            A comprehensive toolkit designed for machine learning engineers, data scientists, and AI safety auditors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-brand-teal/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-teal/10 text-brand-cyan border border-brand-teal/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">
              Detect Bias
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload AI predictions or test datasets to automatically identify statistical disparities, underrepresented cohorts, and skewed acceptance thresholds across groups.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-brand-indigo/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 text-brand-purple border border-brand-indigo/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-indigo transition-colors">
              Measure Fairness
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Compute real mathematical benchmarks: Disparate Impact Ratio (80% rule), Statistical Parity Difference, False Positive Rates (FPR), and False Negative Rates (FNR).
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Explain & Mitigate
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Get plain-English explanations without academic jargon. Test mitigation strategies live in the Before vs After simulator and export compliance-ready audit reports.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Preview Highlight */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-b from-slate-900/60 to-navy-950 p-8 rounded-2xl border border-slate-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-teal">
                Interactive Bias Bounty Protocol
              </span>
              <h3 className="text-2xl font-bold text-white">
                Crowdsourced & Internal AI Bias Bounty Hunting
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Found a demographic or intersectional disparity? Log structured bias bounty tickets with reproducible evidence, severity tagging, and suggested remediations.
              </p>
              <div className="pt-2">
                <button
                  onClick={onLoadDemo}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan hover:text-white"
                >
                  <span>Explore with synthetic dataset</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <p className="text-2xl font-extrabold text-white">4/5th</p>
                <p className="text-xs text-slate-400 mt-1">Disparate Impact Benchmark</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <p className="text-2xl font-extrabold text-brand-teal">6+</p>
                <p className="text-xs text-slate-400 mt-1">Fairness Metrics</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <p className="text-2xl font-extrabold text-amber-400">1-Click</p>
                <p className="text-xs text-slate-400 mt-1">Mitigation Simulator</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <p className="text-2xl font-extrabold text-emerald-400">PDF/Print</p>
                <p className="text-xs text-slate-400 mt-1">Executive Audit Reports</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 border-t border-slate-800/80 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <ShieldCheck className="w-4 h-4 text-brand-teal" />
          <span className="font-medium text-slate-300">BiasGuard AI — Responsible AI Audit Prototype</span>
        </div>
        <p className="text-xs text-slate-500">
          Built for Innov8 4.0 — The Bias Bounty • Functional Full-Stack Prototype
        </p>
      </footer>
    </div>
  );
}
