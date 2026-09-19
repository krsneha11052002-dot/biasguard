import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { 
  UploadCloud, 
  Database, 
  FileSpreadsheet, 
  Sparkles, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Filter, 
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';

export default function Dashboard({ 
  dataset, 
  columns, 
  columnTypes, 
  config, 
  setConfig, 
  onLoadDemo, 
  onRunAudit, 
  loading, 
  error, 
  setDatasetState 
}) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Handle CSV parsing on client
  const processCSV = (file) => {
    setUploadError(null);
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setUploadError('Please select a valid .csv file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setUploadError('The selected CSV file appears to be empty.');
          return;
        }

        const cols = results.meta.fields || Object.keys(results.data[0]);
        if (cols.length < 2) {
          setUploadError('The CSV file needs at least 2 columns (e.g., target outcome and protected group).');
          return;
        }

        // Infer column types
        const types = {};
        cols.forEach((col) => {
          let numCount = 0;
          let totalVal = 0;
          results.data.slice(0, 100).forEach((r) => {
            const v = r[col];
            if (v !== undefined && v !== null && String(v).trim() !== '') {
              totalVal++;
              if (!isNaN(Number(v))) numCount++;
            }
          });
          types[col] = totalVal > 0 && numCount / totalVal > 0.8 ? 'numeric' : 'categorical';
        });

        // Smart guess config
        const guessedTarget = cols.find(c => ['selected', 'hired', 'approved', 'target', 'outcome', 'label'].includes(c.toLowerCase())) || cols[cols.length - 1];
        const guessedProtected = cols.find(c => ['gender', 'sex', 'race', 'age_group', 'age', 'region', 'ethnicity'].includes(c.toLowerCase())) || cols[0];
        const guessedTruth = cols.find(c => ['qualified', 'ground_truth', 'actual', 'y_true'].includes(c.toLowerCase())) || '';

        setDatasetState({
          data: results.data,
          columns: cols,
          columnTypes: types,
          isDemo: false,
          fileName: file.name,
        });

        setConfig({
          targetColumn: guessedTarget,
          protectedColumn: guessedProtected,
          positiveValue: '1',
          groundTruthColumn: guessedTruth,
        });
      },
      error: (err) => {
        setUploadError(`Failed to parse CSV: ${err.message}`);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCSV(e.dataTransfer.files[0]);
    }
  };

  // Calculate missing values in preview
  const missingCount = dataset ? dataset.reduce((acc, row) => {
    let missingInRow = 0;
    Object.values(row).forEach(v => {
      if (v === undefined || v === null || String(v).trim() === '') missingInRow++;
    });
    return acc + missingInRow;
  }, 0) : 0;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Audit Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Load an AI decision dataset, configure demographic protected groups, and execute statistical fairness audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLoadDemo}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-cyan border border-brand-teal/30 hover:border-brand-teal/60 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Demo Dataset</span>
          </button>
        </div>
      </div>

      {/* Upload & Data Source Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload box */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`lg:col-span-2 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            dragOver 
              ? 'border-brand-teal bg-brand-teal/5 scale-[1.005]' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files?.[0] && processCSV(e.target.files[0])} 
            accept=".csv,text/csv" 
            className="hidden" 
          />
          <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 text-brand-cyan border border-brand-teal/20 flex items-center justify-center mb-4 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            Upload AI / Prediction Dataset (.CSV)
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Drag and drop your evaluation CSV here, or click to browse files from your computer.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Supports tabular CSV with demographic and outcome columns</span>
          </div>
        </div>

        {/* Quick Demo Info Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-brand-teal" />
              <h4 className="text-sm font-bold text-white">Built-in Synthetic Demo</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Explore immediate bias detection with a pre-configured hiring decision dataset containing 50 candidates, multi-group demographics, score distributions, and intentional selection disparities.
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed mb-4">
              <strong>Notice:</strong> Synthetic Demo Dataset — for demonstration only. Results do not reflect real-world demographic performance.
            </div>
          </div>
          <button
            onClick={onLoadDemo}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-md shadow-brand-teal/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load & Populate Demo</span>
          </button>
        </div>
      </div>

      {/* Errors */}
      {(uploadError || error) && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{uploadError || error}</span>
        </div>
      )}

      {/* If dataset loaded: Summary & Config */}
      {dataset && dataset.length > 0 && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-4 border border-slate-800">
              <p className="text-xs text-slate-400">Total Rows</p>
              <p className="text-2xl font-bold text-white mt-1">{dataset.length}</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-800">
              <p className="text-xs text-slate-400">Total Columns</p>
              <p className="text-2xl font-bold text-brand-cyan mt-1">{columns.length}</p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-800">
              <p className="text-xs text-slate-400">Missing Values</p>
              <p className={`text-2xl font-bold mt-1 ${missingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {missingCount}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4 border border-slate-800">
              <p className="text-xs text-slate-400">Data Source</p>
              <p className="text-xs font-semibold text-slate-200 mt-2 truncate">
                {config.isDemo ? 'Synthetic Demo CSV' : 'Uploaded File'}
              </p>
            </div>
          </div>

          {/* Column Tags */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <p className="text-xs font-medium text-slate-400 mb-2">Detected Columns & Data Types:</p>
            <div className="flex flex-wrap gap-2">
              {columns.map((col) => {
                const type = columnTypes[col] || 'categorical';
                return (
                  <span 
                    key={col}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border ${
                      type === 'numeric'
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                        : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                    }`}
                  >
                    {col} <span className="text-[10px] opacity-70">({type})</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Audit Configuration */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-brand-teal/20 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <SlidersHorizontal className="w-5 h-5 text-brand-teal" />
              <h3 className="text-base font-bold text-white">Configure Fairness & Bias Audit Parameters</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Target column */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target / Outcome Column *
                </label>
                <select
                  value={config.targetColumn || ''}
                  onChange={(e) => setConfig({ ...config, targetColumn: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal transition-colors font-mono"
                >
                  <option value="" disabled>Select Target Column</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">e.g. selected, hired, approved</p>
              </div>

              {/* Protected column */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Protected Attribute / Demographic Column *
                </label>
                <select
                  value={config.protectedColumn || ''}
                  onChange={(e) => setConfig({ ...config, protectedColumn: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal transition-colors font-mono"
                >
                  <option value="" disabled>Select Demographic Column</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">e.g. gender, age_group, region</p>
              </div>

              {/* Positive Outcome Value */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Positive Outcome Value *
                </label>
                <input
                  type="text"
                  value={config.positiveValue || ''}
                  onChange={(e) => setConfig({ ...config, positiveValue: e.target.value })}
                  placeholder="e.g. 1 or true or Selected"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal transition-colors font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Favorable decision value</p>
              </div>

              {/* Ground Truth Column (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ground Truth / Qualified Column (Optional)
                </label>
                <select
                  value={config.groundTruthColumn || ''}
                  onChange={(e) => setConfig({ ...config, groundTruthColumn: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-teal transition-colors font-mono"
                >
                  <option value="">(None / Auto-estimate)</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Required for FPR & FNR calculations</p>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onRunAudit}
                disabled={loading || !config.targetColumn || !config.protectedColumn}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-lg shadow-brand-teal/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing Statistical Audit...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Bias & Fairness Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dataset Preview Table */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-brand-teal" />
                <h3 className="text-sm font-bold text-white">Dataset Preview (First 8 Records)</h3>
              </div>
              <span className="text-xs text-slate-400">Showing 8 of {dataset.length} total rows</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="px-4 py-3 font-semibold">
                        {col}
                        {col === config.targetColumn && (
                          <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-brand-teal/20 text-brand-cyan font-sans">
                            Target
                          </span>
                        )}
                        {col === config.protectedColumn && (
                          <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-brand-purple/20 text-brand-purple font-sans">
                            Group
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {dataset.slice(0, 8).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-2.5 whitespace-nowrap">
                          {row[col] !== undefined && row[col] !== null ? String(row[col]) : (
                            <span className="text-slate-600 italic">null</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
