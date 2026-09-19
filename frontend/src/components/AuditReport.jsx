import React from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Layers,
  Calendar,
  Database
} from 'lucide-react';

export default function AuditReport({ auditData }) {
  if (!auditData || !auditData.groupMetrics) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>No audit generated yet. Run an audit from the Dashboard first.</p>
      </div>
    );
  }

  const { datasetSummary, groupMetrics, findings, referenceGroup, fairnessScore, timestamp } = auditData;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BiasGuard_Audit_Report_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Action Header (No Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-brand-teal" />
            Executive Fairness Audit Report
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Exportable compliance document summarizing algorithmic fairness testing, disparate impact, and remediation steps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-cyan border border-brand-teal/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-md shadow-brand-teal/20 hover:opacity-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl text-slate-200 print:bg-white print:text-black print:p-0 print:border-none">
        {/* Report Top Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-brand-teal" />
              <span className="font-bold text-xl text-white tracking-tight">BiasGuard AI</span>
              <span className="text-xs px-2 py-0.5 rounded bg-brand-indigo/20 text-brand-cyan font-mono">AUDIT-CERT-PROTOTYPE</span>
            </div>
            <p className="text-xs text-slate-400">Algorithmic Bias, Parity & Fairness Verification Report</p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 space-y-1 font-mono">
            <p><span className="text-slate-500">Timestamp:</span> {timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()}</p>
            <p><span className="text-slate-500">Theme:</span> Innov8 4.0 — The Bias Bounty</p>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Fairness Index</span>
            <p className={`text-2xl font-black mt-1 ${fairnessScore >= 75 ? 'text-emerald-400' : fairnessScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {fairnessScore} / 100
            </p>
            <span className="text-[10px] text-slate-500">Composite Parity Metric</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Evaluated Cohorts</span>
            <p className="text-2xl font-black text-brand-cyan mt-1">{groupMetrics.length} Groups</p>
            <span className="text-[10px] text-slate-500">Ref: {referenceGroup}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Flagged Risk Issues</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{findings.length} Flags</p>
            <span className="text-[10px] text-slate-500">Disparity Violations</span>
          </div>
        </div>

        {/* Audit Configuration Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            1. Audit Configuration & Dataset Scope
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Total Records</span>
              <span className="font-bold text-white">{datasetSummary?.totalRows} rows</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Target Column</span>
              <span className="font-bold text-brand-teal">{datasetSummary?.targetColumn}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Protected Demographic</span>
              <span className="font-bold text-brand-purple">{datasetSummary?.protectedColumn}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Favorable Value</span>
              <span className="font-bold text-emerald-400">"{datasetSummary?.positiveValue}"</span>
            </div>
          </div>
        </div>

        {/* Group Statistics Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            2. Empirical Group Fairness Statistics
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">Demographic Group</th>
                  <th className="px-3 py-2.5">Samples</th>
                  <th className="px-3 py-2.5">Positive Rate</th>
                  <th className="px-3 py-2.5">Parity Diff</th>
                  <th className="px-3 py-2.5">Disparate Impact</th>
                  <th className="px-3 py-2.5">FPR</th>
                  <th className="px-3 py-2.5">FNR</th>
                  <th className="px-3 py-2.5">Disparity Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {groupMetrics.map((g) => (
                  <tr key={g.group}>
                    <td className="px-3 py-2 font-semibold text-white">
                      {g.group} {g.isReference && '(Reference)'}
                    </td>
                    <td className="px-3 py-2">{g.sampleSize}</td>
                    <td className="px-3 py-2">{(g.positiveRate * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2">{(g.statisticalParityDiff * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2 font-bold">{g.disparateImpact.toFixed(2)}</td>
                    <td className="px-3 py-2">{(g.falsePositiveRate * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2">{(g.falseNegativeRate * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2 font-sans text-[10px] font-semibold">
                      <span className={g.disparityStatus === 'High Disparity' ? 'text-red-400' : g.disparityStatus === 'Moderate Disparity' ? 'text-amber-400' : 'text-emerald-400'}>
                        {g.disparityStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Findings Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            3. Automated Audit Findings & Risk Evidence
          </h3>
          {findings.length === 0 ? (
            <p className="text-xs text-slate-400">No critical disparities detected under standard audit thresholds.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {findings.map((f, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{i + 1}. {f.category} — {f.affectedGroup}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold uppercase">
                      {f.severity} Severity
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]"><span className="text-slate-500 font-mono">Evidence:</span> {f.evidence}</p>
                  <p className="text-slate-400 text-[11px]"><span className="text-slate-500 font-mono">Analysis:</span> {f.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actionable Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            4. Recommended Remediation Roadmap
          </h3>
          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <li><strong>Rebalance Datasets:</strong> Increase representation of minority demographic subgroups to ensure balanced gradient representations.</li>
            <li><strong>Threshold Calibration:</strong> Apply equalized odds / demographic parity post-processing to adjust group classification cutoffs.</li>
            <li><strong>Continuous Monitoring:</strong> Re-evaluate fairness benchmarks during weekly batch evaluation pipelines.</li>
          </ul>
        </div>

        {/* Limitations & Legal Notice */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
          <p className="font-bold text-slate-300">Methodological Limitations & Disclaimer:</p>
          <p>
            This audit report is generated by the BiasGuard AI prototype for educational and responsible AI auditing demonstrations. Statistical disparity does not necessarily prove intentional discrimination. Thresholds (e.g. 80% disparate impact ratio) serve as standard screening guidelines and should be evaluated alongside contextual domain considerations.
          </p>
        </div>
      </div>
    </div>
  );
}
