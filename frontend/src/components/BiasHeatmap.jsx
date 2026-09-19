import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  Scale, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle,
  TrendingDown,
  Sparkles
} from 'lucide-react';

export default function BiasHeatmap({ auditData }) {
  if (!auditData || !auditData.groupMetrics) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>No audit results available yet. Run an audit from the Dashboard.</p>
      </div>
    );
  }

  const { groupMetrics, datasetSummary, referenceGroup, fairnessScore } = auditData;

  // Chart data transformations
  const positiveRateData = groupMetrics.map((m) => ({
    name: m.group,
    positiveRate: Math.round(m.positiveRate * 100),
    sampleSize: m.sampleSize,
    isRef: m.isReference,
  }));

  const errorRateData = groupMetrics.map((m) => ({
    name: m.group,
    FPR: Math.round(m.falsePositiveRate * 100),
    FNR: Math.round(m.falseNegativeRate * 100),
    accuracy: Math.round(m.accuracy * 100),
  }));

  const radarData = [
    { metric: 'Selection Rate', ...Object.fromEntries(groupMetrics.map(g => [g.group, Math.round(g.positiveRate * 100)])) },
    { metric: '100 - FNR (Recall)', ...Object.fromEntries(groupMetrics.map(g => [g.group, Math.round((1 - g.falseNegativeRate) * 100)])) },
    { metric: '100 - FPR (Specificity)', ...Object.fromEntries(groupMetrics.map(g => [g.group, Math.round((1 - g.falsePositiveRate) * 100)])) },
    { metric: 'Accuracy', ...Object.fromEntries(groupMetrics.map(g => [g.group, Math.round(g.accuracy * 100)])) },
    { metric: 'Disparate Impact', ...Object.fromEntries(groupMetrics.map(g => [g.group, Math.min(100, Math.round(g.disparateImpact * 100))])) },
  ];

  const radarColors = ['#00B4D8', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899'];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Fairness Heatmap & Demographic Comparison
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual analysis of algorithmic parity, disparate impact ratio, and error rates across demographic cohorts.
          </p>
        </div>

        {/* Global Fairness Score Badge */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-3 px-5 rounded-2xl border border-slate-800">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Fairness Index</p>
            <p className={`text-xl font-black ${fairnessScore >= 75 ? 'text-emerald-400' : fairnessScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {fairnessScore} / 100
            </p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
            fairnessScore >= 75 ? 'bg-emerald-500/20 text-emerald-300' : fairnessScore >= 50 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {fairnessScore >= 75 ? 'PASS' : fairnessScore >= 50 ? 'WARN' : 'ALERT'}
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Reference Group</span>
            <span className="px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan text-[10px] font-mono">Baseline</span>
          </div>
          <p className="text-xl font-bold text-white mb-1">{referenceGroup}</p>
          <p className="text-xs text-slate-400">
            Selected as the reference benchmark based on maximum representation and selection rate.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Disparate Impact Benchmark</span>
            <span className="text-amber-400 text-[10px] font-mono">80% Rule</span>
          </div>
          <p className="text-xl font-bold text-amber-400 mb-1">0.80 - 1.25</p>
          <p className="text-xs text-slate-400">
            Prototype audit standard: ratios below 0.80 signal potential adverse outcome disparities.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Audited Demographic Column</span>
            <span className="text-brand-purple text-[10px] font-mono">Protected</span>
          </div>
          <p className="text-xl font-bold text-brand-purple mb-1">{datasetSummary?.protectedColumn}</p>
          <p className="text-xs text-slate-400">
            Evaluating {groupMetrics.length} detected distinct demographic subgroups.
          </p>
        </div>
      </div>

      {/* Group Statistics Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-teal" />
            <h3 className="text-base font-bold text-white">Demographic Fairness Metrics Breakdown</h3>
          </div>
          <span className="text-[11px] text-slate-400">Thresholds labeled for prototype auditing</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Group</th>
                <th className="px-4 py-3 font-semibold">Sample (N)</th>
                <th className="px-4 py-3 font-semibold">Positive Rate</th>
                <th className="px-4 py-3 font-semibold">Parity Diff</th>
                <th className="px-4 py-3 font-semibold">Disparate Impact</th>
                <th className="px-4 py-3 font-semibold">FPR</th>
                <th className="px-4 py-3 font-semibold">FNR</th>
                <th className="px-4 py-3 font-semibold">Accuracy</th>
                <th className="px-4 py-3 font-semibold">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {groupMetrics.map((g) => (
                <tr key={g.group} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2 font-sans">
                    {g.group}
                    {g.isReference && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-blue/20 text-brand-cyan font-mono">
                        REF
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{g.sampleSize}</td>
                  <td className="px-4 py-3 font-bold text-white">{(g.positiveRate * 100).toFixed(1)}%</td>
                  <td className={`px-4 py-3 ${g.statisticalParityDiff < -0.1 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {(g.statisticalParityDiff * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 font-bold">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      g.disparateImpact < 0.65 ? 'bg-red-500/20 text-red-300' :
                      g.disparateImpact < 0.80 ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {g.disparateImpact.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{(g.falsePositiveRate * 100).toFixed(1)}%</td>
                  <td className={`px-4 py-3 ${g.falseNegativeRate > 0.4 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                    {(g.falseNegativeRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">{(g.accuracy * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 font-sans">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      g.disparityStatus === 'High Disparity' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      g.disparityStatus === 'Moderate Disparity' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {g.disparityStatus === 'High Disparity' ? <AlertOctagon className="w-3 h-3" /> :
                       g.disparityStatus === 'Moderate Disparity' ? <AlertTriangle className="w-3 h-3" /> :
                       <CheckCircle2 className="w-3 h-3" />}
                      {g.disparityStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Positive Outcome Rate Comparison */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-teal" />
              Positive Outcome Rate by Group (%)
            </h4>
            <span className="text-[10px] text-slate-400">Demographic Parity View</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positiveRateData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis unit="%" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1C2541', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                  formatter={(val) => [`${val}%`, 'Selection Rate']}
                />
                <Bar dataKey="positiveRate" radius={[6, 6, 0, 0]}>
                  {positiveRateData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isRef ? '#00B4D8' : entry.positiveRate < 40 ? '#F87171' : '#818CF8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Measures the percentage of each cohort receiving a favorable outcome (e.g. selected or approved). A wide gap indicates statistical parity divergence.
          </p>
        </div>

        {/* Chart 2: False Positive & False Negative Rates */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              Error Disparity: FPR vs FNR (%)
            </h4>
            <span className="text-[10px] text-slate-400">Equalized Odds View</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorRateData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis unit="%" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1C2541', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="FPR" name="False Positive Rate" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="FNR" name="False Negative Rate" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            High False Negative Rates (red) mean qualified candidates were denied opportunities. High False Positive Rates mean unqualified candidates were accepted.
          </p>
        </div>
      </div>

      {/* Radar Comparison Chart & Metric Dictionary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Dimensional Radar */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 lg:col-span-1 space-y-3">
          <h4 className="text-sm font-bold text-white">Multi-Dimensional Balance</h4>
          <p className="text-[11px] text-slate-400">Comparing fairness attributes per group (higher is more balanced)</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1C2541" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#3A506B" tick={{ fontSize: 9 }} />
                {groupMetrics.map((g, idx) => (
                  <Radar
                    key={g.group}
                    name={g.group}
                    dataKey={g.group}
                    stroke={radarColors[idx % radarColors.length]}
                    fill={radarColors[idx % radarColors.length]}
                    fillOpacity={0.2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explain Every Metric in Simple Language Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Info className="w-4 h-4 text-brand-cyan" />
            <h4 className="text-sm font-bold text-white">Fairness Metrics Dictionary & Simple Explanations</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-brand-cyan">Disparate Impact Ratio:</span>
              <p className="text-slate-300 leading-relaxed">
                "Ratio of the positive outcome rate of a group to the reference group's positive outcome rate."
              </p>
              <p className="text-[10px] text-slate-400">Standard test: Ratios &lt; 0.80 indicate potential adverse impact.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-brand-purple">Statistical Parity Difference:</span>
              <p className="text-slate-300 leading-relaxed">
                "The raw percentage difference between a group's selection rate and the reference group's rate."
              </p>
              <p className="text-[10px] text-slate-400">A value of 0.00 represents exact equal probability of selection.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-rose-400">False Negative Rate (FNR):</span>
              <p className="text-slate-300 leading-relaxed">
                "The percentage of qualified candidates in a group who were mistakenly rejected or denied."
              </p>
              <p className="text-[10px] text-slate-400">High FNR causes qualified minority candidates to be overlooked.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-sky-400">False Positive Rate (FPR):</span>
              <p className="text-slate-300 leading-relaxed">
                "The percentage of unqualified candidates who received an affirmative or favorable prediction."
              </p>
              <p className="text-[10px] text-slate-400">Important for punitive domains (e.g. fraud or recidivism models).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
