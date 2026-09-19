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
  Database,
  Sparkles,
  FileCode
} from 'lucide-react';

export default function AuditReport({ auditData, onLoadDemo }) {
  if (!auditData || !auditData.groupMetrics) {
    return (
      <div className="glass-card max-w-2xl mx-auto rounded-3xl p-10 text-center border border-slate-800 space-y-5">
        <FileText className="w-12 h-12 text-brand-teal mx-auto stroke-[1.5]" />
        <div>
          <h3 className="text-lg font-bold text-white mb-1">No Audit Report Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Run an audit from the Audit Dashboard or load the demo dataset to immediately produce a complete executive fairness audit report.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Demo Audit Report Now</span>
          </button>
        </div>
      </div>
    );
  }

  const { datasetSummary, groupMetrics, findings, referenceGroup, fairnessScore, timestamp } = auditData;

  // 1. Download Structured JSON
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BiasGuard_Audit_Report_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 2. Download Formatted HTML/Document Audit Report
  const handleDownloadHTMLReport = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BiasGuard AI — Fairness Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 40px auto; padding: 0 20px; background: #f8fafc; }
    .header { background: #0f172a; color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
    .header h1 { margin: 0 0 8px 0; font-size: 24px; color: #38bdf8; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .badge-pass { background: #dcfce7; color: #166534; }
    .badge-warn { background: #fef3c7; color: #92400e; }
    .badge-alert { background: #fee2e2; color: #991b1b; }
    .section { background: white; padding: 25px; border-radius: 10px; margin-bottom: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .section h2 { margin-top: 0; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; color: #0f172a; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: 600; color: #475569; }
    .finding-card { background: #fff1f2; border-left: 4px solid #e11d48; padding: 12px; margin-top: 10px; border-radius: 4px; font-size: 13px; }
    .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>BiasGuard AI — Executive Fairness & Bias Audit Report</h1>
    <p style="margin:0; opacity:0.8; font-size:13px;">Responsible AI Audit & Governance Engine • Innov8 4.0 — The Bias Bounty</p>
    <p style="margin:5px 0 0 0; opacity:0.6; font-size:11px;">Audit Timestamp: ${timestamp || new Date().toISOString()}</p>
  </div>

  <div class="section">
    <h2>1. Executive Summary & Fairness Score</h2>
    <p><strong>Overall Fairness Index:</strong> <span class="badge ${fairnessScore >= 75 ? 'badge-pass' : fairnessScore >= 50 ? 'badge-warn' : 'badge-alert'}">${fairnessScore} / 100</span></p>
    <p><strong>Audited Demographic Column:</strong> ${datasetSummary?.protectedColumn}</p>
    <p><strong>Target Decision Column:</strong> ${datasetSummary?.targetColumn} (Positive Outcome: "${datasetSummary?.positiveValue}")</p>
    <p><strong>Reference Benchmark Group:</strong> ${referenceGroup}</p>
    <p><strong>Total Flags Detected:</strong> ${findings.length} Disparity Flags</p>
  </div>

  <div class="section">
    <h2>2. Group Statistics & Disparities</h2>
    <table>
      <thead>
        <tr>
          <th>Demographic Group</th>
          <th>Sample Size</th>
          <th>Positive Selection Rate</th>
          <th>Statistical Parity Diff</th>
          <th>Disparate Impact Ratio</th>
          <th>FPR</th>
          <th>FNR</th>
          <th>Audit Status</th>
        </tr>
      </thead>
      <tbody>
        ${groupMetrics.map(g => `
          <tr>
            <td><strong>${g.group}</strong> ${g.isReference ? '(Ref)' : ''}</td>
            <td>${g.sampleSize}</td>
            <td>${(g.positiveRate * 100).toFixed(1)}%</td>
            <td>${(g.statisticalParityDiff * 100).toFixed(1)}%</td>
            <td><strong>${g.disparateImpact.toFixed(2)}</strong></td>
            <td>${(g.falsePositiveRate * 100).toFixed(1)}%</td>
            <td>${(g.falseNegativeRate * 100).toFixed(1)}%</td>
            <td>${g.disparityStatus}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>3. Detected Algorithmic Bias Findings</h2>
    ${findings.length === 0 ? '<p>No critical disparities detected.</p>' : findings.map((f, i) => `
      <div class="finding-card">
        <strong>${i+1}. ${f.category} (${f.severity} Severity)</strong> — Group: ${f.affectedGroup}<br>
        <strong>Metric Observed:</strong> ${f.metric} = ${f.metricValue}<br>
        <strong>Evidence:</strong> ${f.evidence}<br>
        <strong>Explanation:</strong> ${f.explanation}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>4. Practical Remediation Playbook</h2>
    <ul>
      <li><strong>Subgroup Threshold Calibration:</strong> Adjust decision score thresholds per group to balance Equalized Odds and reduce False Negative disparities.</li>
      <li><strong>Training-Data Rebalancing:</strong> Augment underrepresented demographic cohorts to normalize model loss representation.</li>
      <li><strong>Feature Correlation Review:</strong> Remove proxy features that correlate strongly with protected attributes.</li>
    </ul>
  </div>

  <div class="footer">
    <p>BiasGuard AI — Responsible AI Audit Prototype • Built for Innov8 4.0 — The Bias Bounty</p>
    <p>Disclaimer: This audit report is generated for educational and responsible AI demonstration purposes.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BiasGuard_Executive_Audit_Report_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadHTMLReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-md shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit Report (.HTML)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Download JSON Report</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-cyan border border-brand-teal/30 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
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
