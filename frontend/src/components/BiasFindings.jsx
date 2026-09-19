import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  HelpCircle, 
  ChevronRight, 
  ShieldAlert, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  X
} from 'lucide-react';

export default function BiasFindings({ auditData, onNavigateToSimulator, onNavigateToBounty }) {
  const [selectedFinding, setSelectedFinding] = useState(null);

  if (!auditData || !auditData.findings) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>No findings available. Run an audit from the Dashboard first.</p>
      </div>
    );
  }

  const { findings, groupMetrics, datasetSummary } = auditData;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
            Detected Bias Findings & Risk Flags
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Algorithmic disparities identified by testing mathematical fairness criteria on your dataset.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
            {findings.length} Automated Flags
          </span>
        </div>
      </div>

      {/* Cautionary banner */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Responsible AI Audit Guidance:</strong> Potential disparity detected — further investigation recommended. Statistical divergence does not by itself prove intentional discrimination; it indicates unequal impact that requires testing for proxy variables, historical data imbalances, or threshold sensitivities.
        </div>
      </div>

      {/* Findings Grid & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Findings Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Prioritized Audit Issues
          </h3>

          {findings.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">No Critical Disparities Detected</h4>
              <p className="text-xs text-slate-400">
                All demographic groups satisfy standard statistical parity and 80% disparate impact ratio thresholds.
              </p>
            </div>
          ) : (
            findings.map((finding) => {
              const isSelected = selectedFinding?.id === finding.id;
              return (
                <div
                  key={finding.id}
                  onClick={() => setSelectedFinding(finding)}
                  className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer hover:scale-[1.01] ${
                    isSelected 
                      ? 'border-brand-teal bg-navy-850 shadow-lg shadow-brand-teal/10 ring-1 ring-brand-teal/40' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        finding.severity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        finding.severity === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {finding.severity === 'High' ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            finding.severity === 'High' ? 'bg-red-500/20 text-red-300' :
                            finding.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {finding.severity} Severity
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {finding.category}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-xs text-brand-cyan font-medium">
                            Group: {finding.affectedGroup}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1.5">
                          {finding.metric}: <span className="text-amber-400">{finding.metricValue}</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2">
                          <strong>Evidence:</strong> {finding.evidence}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {finding.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center text-brand-teal text-xs font-semibold gap-1 self-center">
                      <span>Explain</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: AI Explanation Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">AI Explanation Panel</h3>
              </div>
              {selectedFinding && (
                <button
                  onClick={() => setSelectedFinding(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedFinding ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Flagged Item</span>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedFinding.category}</p>
                  <p className="text-brand-cyan font-mono mt-0.5">Cohort: {selectedFinding.affectedGroup}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <p className="font-bold text-slate-200">Why was this flagged?</p>
                  <p className="text-slate-300 leading-relaxed">{selectedFinding.explanation}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <p className="font-bold text-amber-400">What the result indicates:</p>
                  <p className="text-slate-300 leading-relaxed">
                    The positive outcome rate or error distribution for group "{selectedFinding.affectedGroup}" diverges significantly from the reference baseline. This suggests potential algorithmic disparity.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <p className="font-bold text-brand-teal">What should be investigated next?</p>
                  <p className="text-slate-300 leading-relaxed">{selectedFinding.investigationGuide}</p>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={onNavigateToSimulator}
                    className="w-full py-2.5 rounded-xl bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-cyan border border-brand-teal/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Simulate Mitigation for this finding</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigateToBounty(selectedFinding)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Submit as Bias Bounty Ticket</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 space-y-3">
                <HelpCircle className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
                <p className="text-xs">
                  Click on any detected finding on the left to inspect its transparent AI explanation, root cause analysis, and remediation guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
