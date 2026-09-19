import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Send, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  Terminal,
  Printer
} from 'lucide-react';

export default function BiasBounty({ prefillFinding }) {
  const [bountyForm, setBountyForm] = useState({
    title: 'Disparate Impact in Hiring Selection Thresholds',
    category: 'Demographic Bias',
    affectedGroup: 'Female & Non-Binary',
    metric: 'Disparate Impact Ratio (< 0.70)',
    description: 'The automated resume screening algorithm exhibits significantly lower selection rates for female candidates (38%) compared to reference male candidates (85%), failing the standard 80% four-fifths fairness rule.',
    evidence: 'Calculated Disparate Impact Ratio = 0.45; False Negative Rate for female candidates = 52.4% with positive qualification labels.',
    suggestedMitigation: 'Implement subgroup threshold calibration on candidate scoring weights and conduct proxy variable elimination on experience tenure fields.',
    reproducibility: 'Upload synthetic hiring evaluation dataset (50 samples); evaluate outcome column "selected" with protected group "gender".',
  });

  const [submittedBounty, setSubmittedBounty] = useState(null);
  const [copied, setCopied] = useState(false);

  // If a finding was passed from the findings panel, prefill
  useEffect(() => {
    if (prefillFinding) {
      setBountyForm({
        title: `Fairness Disparity Flag: ${prefillFinding.category} in ${prefillFinding.affectedGroup}`,
        category: prefillFinding.category.includes('Representation') ? 'Representation Bias' : 'Outcome Bias',
        affectedGroup: prefillFinding.affectedGroup,
        metric: `${prefillFinding.metric} (${prefillFinding.metricValue})`,
        description: prefillFinding.explanation,
        evidence: prefillFinding.evidence,
        suggestedMitigation: prefillFinding.investigationGuide || 'Rebalance training data and calibrate group decision thresholds.',
        reproducibility: 'Generated from BiasGuard AI statistical audit module.',
      });
    }
  }, [prefillFinding]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bountyTicket = {
      bountyId: `BB-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      status: 'VERIFIED_SUBMISSION',
      bountyRewardTier: 'TIER-1 RESPONSIBLE AI BOUNTY',
      ...bountyForm,
    };
    setSubmittedBounty(bountyTicket);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(submittedBounty, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-brand-teal" />
            Submit a Bias Bounty Report
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            "The Bias Bounty" — Document discovered algorithmic biases, log reproducible evidence, and generate structured vulnerability tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-cyan text-xs font-semibold">
            Hackathon Bounty Program
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-sm font-bold text-white">Bias Vulnerability Submission Form</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Bounty Title / Problem Summary *
              </label>
              <input
                type="text"
                required
                value={bountyForm.title}
                onChange={(e) => setBountyForm({ ...bountyForm, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bias Category *
                </label>
                <select
                  value={bountyForm.category}
                  onChange={(e) => setBountyForm({ ...bountyForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-teal"
                >
                  <option value="Demographic Bias">Demographic Bias</option>
                  <option value="Representation Bias">Representation Bias</option>
                  <option value="Outcome Bias">Outcome Bias</option>
                  <option value="Measurement Bias">Measurement Bias</option>
                  <option value="Intersectional Bias">Intersectional Bias</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Affected Demographic Cohort *
                </label>
                <input
                  type="text"
                  required
                  value={bountyForm.affectedGroup}
                  onChange={(e) => setBountyForm({ ...bountyForm, affectedGroup: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-teal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Violated Fairness Metric *
                </label>
                <input
                  type="text"
                  required
                  value={bountyForm.metric}
                  onChange={(e) => setBountyForm({ ...bountyForm, metric: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-teal"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Severity Assessment
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-bold">
                    HIGH IMPACT
                  </span>
                  <span className="text-[10px] text-slate-400">Autonomous Selection Bias</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Detailed Description of Algorithmic Disparity *
              </label>
              <textarea
                rows={3}
                required
                value={bountyForm.description}
                onChange={(e) => setBountyForm({ ...bountyForm, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Audit Evidence & Quantitative Metrics *
              </label>
              <textarea
                rows={2}
                required
                value={bountyForm.evidence}
                onChange={(e) => setBountyForm({ ...bountyForm, evidence: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-teal font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Suggested Engineering Mitigation *
              </label>
              <textarea
                rows={2}
                required
                value={bountyForm.suggestedMitigation}
                onChange={(e) => setBountyForm({ ...bountyForm, suggestedMitigation: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Reproducibility Information
              </label>
              <input
                type="text"
                value={bountyForm.reproducibility}
                onChange={(e) => setBountyForm({ ...bountyForm, reproducibility: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-teal font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-lg shadow-brand-teal/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Generate Structured Bias Bounty Report</span>
            </button>
          </form>
        </div>

        {/* Right Structured Ticket Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Generated Bounty Ticket Preview
          </h3>

          {submittedBounty ? (
            <div className="glass-panel rounded-2xl p-6 border border-brand-teal/40 space-y-4 text-xs bg-gradient-to-b from-navy-900 to-navy-950 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-brand-cyan font-bold">{submittedBounty.bountyId}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{submittedBounty.title}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Category</span>
                  <span className="font-bold text-white">{submittedBounty.category}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Cohort</span>
                  <span className="font-bold text-brand-cyan">{submittedBounty.affectedGroup}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Metric & Disparity</span>
                <p className="font-mono text-amber-400 text-[11px]">{submittedBounty.metric}</p>
                <p className="text-slate-300 text-[11px] mt-1">{submittedBounty.evidence}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Problem Description</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{submittedBounty.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-400">Suggested Mitigation</span>
                <p className="text-emerald-200 text-[11px] leading-relaxed">{submittedBounty.suggestedMitigation}</p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied JSON!' : 'Copy Ticket JSON'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-cyan border border-brand-teal/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400 border border-slate-800 space-y-3">
              <Award className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
              <p className="text-xs">
                Fill out the Bias Bounty form on the left or flag a finding from the audit results to generate an official bounty report card.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
