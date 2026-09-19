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
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  PieChart as PieIcon, 
  Layers, 
  TrendingUp, 
  Users, 
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';

export default function StatsAnalytics({ dataset, columns, columnTypes, auditData, onLoadDemo, onGoToDashboard }) {
  if (!dataset || dataset.length === 0) {
    return (
      <div className="glass-card max-w-2xl mx-auto rounded-3xl p-10 text-center border border-slate-800 space-y-5">
        <Database className="w-12 h-12 text-brand-teal mx-auto stroke-[1.5]" />
        <div>
          <h3 className="text-lg font-bold text-white mb-1">No Dataset Loaded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Load the built-in synthetic dataset or upload your own CSV from the Audit Dashboard to view comprehensive cohort analytics.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-lg shadow-brand-teal/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Demo Dataset</span>
          </button>
          <button
            onClick={onGoToDashboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-all"
          >
            <span>Go to Upload Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Demographic distribution calculation
  const protectedCol = auditData?.datasetSummary?.protectedColumn || columns.find(c => ['gender', 'sex', 'race', 'age_group'].includes(c.toLowerCase())) || columns[1] || columns[0];
  const targetCol = auditData?.datasetSummary?.targetColumn || columns.find(c => ['selected', 'hired', 'outcome'].includes(c.toLowerCase())) || columns[columns.length - 1];

  const groupCounts = {};
  const crossTab = {};

  dataset.forEach((row) => {
    const grp = String(row[protectedCol] || 'Unknown').trim();
    const outcome = String(row[targetCol] || 'Unknown').trim();

    groupCounts[grp] = (groupCounts[grp] || 0) + 1;

    if (!crossTab[grp]) crossTab[grp] = { group: grp, Positive: 0, Negative: 0 };
    if (outcome.toLowerCase() === 'yes' || outcome === '1' || outcome.toLowerCase() === 'true') {
      crossTab[grp].Positive += 1;
    } else {
      crossTab[grp].Negative += 1;
    }
  });

  const pieData = Object.entries(groupCounts).map(([name, value]) => ({ name, value }));
  const barData = Object.values(crossTab);
  const COLORS = ['#00B4D8', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899', '#38BDF8'];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <PieIcon className="w-8 h-8 text-brand-teal" />
            Dataset Demographic & Outcome Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Exploratory data analysis of cohort balance, selection cross-tabulations, and feature distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
            {dataset.length} Total Records
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <p className="text-xs text-slate-400">Audited Protected Feature</p>
          <p className="text-xl font-bold text-brand-cyan mt-1 truncate">{protectedCol}</p>
          <p className="text-[10px] text-slate-500 mt-1">{Object.keys(groupCounts).length} Distinct Categories</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <p className="text-xs text-slate-400">Target Outcome Feature</p>
          <p className="text-xl font-bold text-brand-purple mt-1 truncate">{targetCol}</p>
          <p className="text-[10px] text-slate-500 mt-1">Binary Decision Label</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <p className="text-xs text-slate-400">Total Features</p>
          <p className="text-xl font-bold text-white mt-1">{columns.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">
            {Object.values(columnTypes).filter(t => t === 'numeric').length} Numeric, {Object.values(columnTypes).filter(t => t === 'categorical').length} Categorical
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <p className="text-xs text-slate-400">Audit Status</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {auditData ? `${auditData.fairnessScore} / 100` : 'Ready'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">{auditData ? `${auditData.findings.length} Flags` : 'Pending'}</p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Representation Pie */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-teal" />
              Demographic Group Representation (%)
            </h4>
            <span className="text-[10px] text-slate-400">Sample Share</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1C2541', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            Shows sample size breakdown per cohort. Cohorts below 10% sample size can produce high metric variance.
          </p>
        </div>

        {/* Outcome Cross-Tabulation */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-indigo" />
              Selection vs Rejection Volume by Cohort
            </h4>
            <span className="text-[10px] text-slate-400">Counts</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
                <XAxis dataKey="group" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1C2541', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Positive" name="Selected (Positive)" fill="#00B4D8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Negative" name="Rejected (Negative)" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            Absolute volume of positive selections (blue) compared to unfavorable outcomes (red) for each subgroup.
          </p>
        </div>
      </div>
    </div>
  );
}
