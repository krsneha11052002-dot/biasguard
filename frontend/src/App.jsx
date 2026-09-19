import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import BiasHeatmap from './components/BiasHeatmap';
import BiasFindings from './components/BiasFindings';
import MitigationSimulator from './components/MitigationSimulator';
import BiasBounty from './components/BiasBounty';
import AuditReport from './components/AuditReport';
import DemoGuideModal from './components/DemoGuideModal';

// Built-in fallback demo records
const DEFAULT_DEMO_CSV = `id,gender,age_group,education,experience,region,score,qualified,selected
1,Female,25-34,Master,4,North,82,1,0
2,Male,35-44,Bachelor,8,North,78,1,1
3,Male,25-34,Master,3,West,88,1,1
4,Female,18-24,Bachelor,2,South,65,0,0
5,Non-Binary,25-34,Bachelor,5,East,74,1,0
6,Male,45-54,PhD,15,North,91,1,1
7,Female,35-44,Master,9,East,84,1,0
8,Male,25-34,Bachelor,4,West,72,0,1
9,Female,25-34,PhD,6,North,89,1,1
10,Male,35-44,Master,10,South,81,1,1
11,Female,45-54,Bachelor,12,West,70,0,0
12,Non-Binary,18-24,Bachelor,1,North,68,0,0
13,Male,25-34,Master,5,East,85,1,1
14,Female,35-44,Bachelor,7,South,79,1,0
15,Male,18-24,Bachelor,2,North,73,0,1
16,Female,25-34,Master,4,West,86,1,0
17,Male,35-44,PhD,11,East,90,1,1
18,Female,18-24,Bachelor,1,North,62,0,0
19,Male,25-34,Bachelor,3,South,77,1,1
20,Non-Binary,35-44,Master,8,West,83,1,0
21,Female,45-54,PhD,14,North,87,1,1
22,Male,25-34,Master,5,North,79,1,1
23,Female,25-34,Bachelor,4,East,75,1,0
24,Male,35-44,Bachelor,9,West,80,1,1
25,Female,35-44,Master,6,South,81,1,0
26,Male,18-24,Bachelor,2,East,69,0,0
27,Non-Binary,25-34,Master,4,North,78,1,0
28,Female,25-34,PhD,5,West,85,1,1
29,Male,45-54,Bachelor,16,South,76,1,1
30,Female,18-24,Bachelor,1,East,64,0,0
31,Male,25-34,Master,4,North,84,1,1
32,Female,35-44,Bachelor,8,West,77,1,0
33,Male,35-44,PhD,12,East,93,1,1
34,Female,25-34,Master,3,North,80,1,0
35,Non-Binary,45-54,Bachelor,13,South,71,0,0
36,Male,25-34,Bachelor,5,West,82,1,1
37,Female,45-54,Master,15,East,88,1,1
38,Male,18-24,Bachelor,2,North,70,0,1
39,Female,25-34,Bachelor,4,South,76,1,0
40,Male,35-44,Master,7,West,85,1,1
41,Female,35-44,PhD,10,North,92,1,1
42,Non-Binary,25-34,Bachelor,3,East,73,0,0
43,Male,25-34,Master,6,South,83,1,1
44,Female,18-24,Bachelor,1,West,66,0,0
45,Male,45-54,Master,14,North,86,1,1
46,Female,25-34,Master,5,East,82,1,0
47,Male,35-44,Bachelor,8,South,78,1,1
48,Female,35-44,Bachelor,6,North,74,0,0
49,Non-Binary,35-44,PhD,9,West,89,1,1
50,Male,25-34,Master,4,East,81,1,1`;

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [datasetState, setDatasetState] = useState({
    data: null,
    columns: [],
    columnTypes: {},
    isDemo: false,
    fileName: '',
  });

  const [config, setConfig] = useState({
    targetColumn: 'selected',
    protectedColumn: 'gender',
    positiveValue: '1',
    groundTruthColumn: 'qualified',
  });

  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bountyPrefill, setBountyPrefill] = useState(null);

  // Demo Guide Tour state
  const [demoTourOpen, setDemoTourOpen] = useState(false);
  const [demoTourStep, setDemoTourStep] = useState(1);

  // Client-side fallback audit engine
  const runClientAudit = (records, cfg) => {
    const { targetColumn, protectedColumn, positiveValue, groundTruthColumn } = cfg;
    const groups = {};
    const posValStr = String(positiveValue).trim().toLowerCase();
    const truthCol = groundTruthColumn || 'qualified';

    records.forEach((row) => {
      const g = String(row[protectedColumn] || '').trim();
      if (!g) return;
      if (!groups[g]) groups[g] = { group: g, total: 0, positiveCount: 0, tp: 0, fp: 0, tn: 0, fn: 0 };
      groups[g].total++;

      const isPos = String(row[targetColumn] || '').trim().toLowerCase() === posValStr;
      if (isPos) groups[g].positiveCount++;

      const isTruthPos = String(row[truthCol] || '').trim().toLowerCase() === posValStr || String(row[truthCol]) === '1';
      if (isPos && isTruthPos) groups[g].tp++;
      else if (isPos && !isTruthPos) groups[g].fp++;
      else if (!isPos && !isTruthPos) groups[g].tn++;
      else if (!isPos && isTruthPos) groups[g].fn++;
    });

    const groupNames = Object.keys(groups);
    let refGroup = groupNames[0];
    let maxPosRate = -1;

    groupNames.forEach((name) => {
      const rate = groups[name].total > 0 ? groups[name].positiveCount / groups[name].total : 0;
      if (rate > maxPosRate) {
        maxPosRate = rate;
        refGroup = name;
      }
    });

    const refRate = groups[refGroup].positiveCount / groups[refGroup].total;
    const groupMetrics = [];
    const findings = [];

    groupNames.forEach((name) => {
      const g = groups[name];
      const posRate = g.total > 0 ? g.positiveCount / g.total : 0;
      const statParityDiff = posRate - refRate;
      const disparateImpact = refRate > 0 ? posRate / refRate : 1;
      const fpr = (g.fp + g.tn) > 0 ? g.fp / (g.fp + g.tn) : 0;
      const fnr = (g.tp + g.fn) > 0 ? g.fn / (g.tp + g.fn) : 0;
      const accuracy = g.total > 0 ? (g.tp + g.tn) / g.total : 0.8;

      let disparityStatus = 'Low Disparity';
      let statusColor = 'green';
      if (disparateImpact < 0.65 || disparateImpact > 1.5) {
        disparityStatus = 'High Disparity';
        statusColor = 'red';
      } else if (disparateImpact < 0.80 || disparateImpact > 1.25) {
        disparityStatus = 'Moderate Disparity';
        statusColor = 'amber';
      }

      groupMetrics.push({
        group: name,
        sampleSize: g.total,
        positiveCount: g.positiveCount,
        positiveRate: Number(posRate.toFixed(3)),
        statisticalParityDiff: Number(statParityDiff.toFixed(3)),
        disparateImpact: Number(disparateImpact.toFixed(3)),
        falsePositiveRate: Number(fpr.toFixed(3)),
        falseNegativeRate: Number(fnr.toFixed(3)),
        accuracy: Number(accuracy.toFixed(3)),
        disparityStatus,
        statusColor,
        isReference: name === refGroup,
      });

      if (name !== refGroup && disparateImpact < 0.80) {
        findings.push({
          id: `di-${name}`,
          severity: disparateImpact < 0.65 ? 'High' : 'Moderate',
          category: 'Disparate Impact Disparity',
          metric: 'Disparate Impact Ratio',
          affectedGroup: name,
          metricValue: `${(disparateImpact * 100).toFixed(1)}%`,
          evidence: `Positive outcome rate is ${(posRate * 100).toFixed(1)}% vs ${(refRate * 100).toFixed(1)}% for reference group (${refGroup}).`,
          explanation: `The positive outcome rate for "${name}" is significantly below the 80% benchmark rule. Potential disparity detected — further investigation recommended. Disparity does not automatically prove intentional discrimination.`,
          investigationGuide: `Review candidate feature representations, proxy correlates with ${protectedColumn}, and decision score thresholds.`,
        });
      }

      if (fnr > 0.35) {
        findings.push({
          id: `fnr-${name}`,
          severity: fnr > 0.5 ? 'High' : 'Moderate',
          category: 'Outcome Error Rate Disparity',
          metric: 'False Negative Rate (FNR)',
          affectedGroup: name,
          metricValue: `${(fnr * 100).toFixed(1)}%`,
          evidence: `False Negative Rate is ${(fnr * 100).toFixed(1)}%, indicating qualified individuals were rejected.`,
          explanation: `Qualified candidates from group "${name}" have a higher rate of false rejection, indicating an unequal opportunity distribution.`,
          investigationGuide: `Calibrate classification decision cutoffs to balance equalized odds across demographic subgroups.`,
        });
      }
    });

    const minDI = Math.min(...groupMetrics.map((m) => m.disparateImpact));
    const maxFNRDiff = Math.max(...groupMetrics.map((m) => m.falseNegativeRate)) - Math.min(...groupMetrics.map((m) => m.falseNegativeRate));
    const score = Math.max(10, Math.min(100, Math.round((minDI * 60) + ((1 - maxFNRDiff) * 40))));

    return {
      datasetSummary: {
        totalRows: records.length,
        totalColumns: Object.keys(records[0] || {}).length,
        missingValues: 0,
        columns: Object.keys(records[0] || {}),
        targetColumn,
        protectedColumn,
        positiveValue,
        referenceGroup: refGroup,
      },
      fairnessScore: score,
      groupMetrics,
      findings,
      referenceGroup: refGroup,
      timestamp: new Date().toISOString(),
    };
  };

  // Load Demo dataset
  const handleLoadDemo = async (autoAudit = true) => {
    setLoading(true);
    setError(null);
    try {
      let records = [];
      let cols = [];
      let colTypes = {};

      try {
        const res = await fetch('/api/demo-data');
        if (res.ok) {
          const json = await res.json();
          records = json.records;
          cols = json.columns;
          colTypes = json.columnTypes;
        } else {
          throw new Error('Fallback to local');
        }
      } catch (e) {
        // Parse built-in CSV
        const lines = DEFAULT_DEMO_CSV.trim().split('\n');
        cols = lines[0].split(',');
        records = lines.slice(1).map((line) => {
          const vals = line.split(',');
          const obj = {};
          cols.forEach((col, i) => {
            obj[col] = vals[i];
          });
          return obj;
        });
        cols.forEach((c) => {
          colTypes[c] = ['id', 'experience', 'score', 'qualified', 'selected'].includes(c) ? 'numeric' : 'categorical';
        });
      }

      setDatasetState({
        data: records,
        columns: cols,
        columnTypes: colTypes,
        isDemo: true,
        fileName: 'synthetic_demo_hiring_dataset.csv',
      });

      const demoConfig = {
        targetColumn: 'selected',
        protectedColumn: 'gender',
        positiveValue: '1',
        groundTruthColumn: 'qualified',
      };
      setConfig(demoConfig);

      if (autoAudit) {
        const auditRes = runClientAudit(records, demoConfig);
        setAuditData(auditRes);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load demo dataset.');
    } finally {
      setLoading(false);
    }
  };

  // Run audit
  const handleRunAudit = async () => {
    if (!datasetState.data || datasetState.data.length === 0) {
      setError('Please load or upload a dataset first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result = null;
      try {
        const res = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            records: datasetState.data,
            config,
          }),
        });
        if (res.ok) {
          result = await res.json();
        }
      } catch (netErr) {
        // Fallback to client calculations
      }

      if (!result) {
        result = runClientAudit(datasetState.data, config);
      }

      setAuditData(result);
      setActiveTab('heatmap');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Audit calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Auto load demo on initial visit if desired
  useEffect(() => {
    handleLoadDemo(true);
  }, []);

  // Handle tour steps
  const handleActionStep = (stepNum, targetTab) => {
    if (stepNum === 1) {
      handleLoadDemo(false);
      setActiveTab('dashboard');
    } else if (stepNum === 2) {
      handleRunAudit();
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleNavigateToBountyFromFinding = (finding) => {
    setBountyPrefill(finding);
    setActiveTab('bounty');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartDemo={() => {
          setDemoTourStep(1);
          setDemoTourOpen(true);
        }}
        hasAuditData={!!auditData}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <LandingPage
            onStartAudit={() => setActiveTab('dashboard')}
            onLoadDemo={() => {
              handleLoadDemo(true);
              setActiveTab('heatmap');
            }}
            onStartDemo={() => {
              setDemoTourStep(1);
              setDemoTourOpen(true);
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            dataset={datasetState.data}
            columns={datasetState.columns}
            columnTypes={datasetState.columnTypes}
            config={config}
            setConfig={setConfig}
            onLoadDemo={() => handleLoadDemo(true)}
            onRunAudit={handleRunAudit}
            loading={loading}
            error={error}
            setDatasetState={setDatasetState}
          />
        )}

        {activeTab === 'heatmap' && (
          <BiasHeatmap auditData={auditData} />
        )}

        {activeTab === 'findings' && (
          <BiasFindings
            auditData={auditData}
            onNavigateToSimulator={() => setActiveTab('simulator')}
            onNavigateToBounty={handleNavigateToBountyFromFinding}
          />
        )}

        {activeTab === 'simulator' && (
          <MitigationSimulator auditData={auditData} />
        )}

        {activeTab === 'bounty' && (
          <BiasBounty prefillFinding={bountyPrefill} />
        )}

        {activeTab === 'report' && (
          <AuditReport auditData={auditData} />
        )}
      </main>

      {/* Interactive Hackathon Guided Demo Modal */}
      <DemoGuideModal
        isOpen={demoTourOpen}
        onClose={() => setDemoTourOpen(false)}
        currentStep={demoTourStep}
        setCurrentStep={setDemoTourStep}
        onActionStep={handleActionStep}
      />
    </div>
  );
}
