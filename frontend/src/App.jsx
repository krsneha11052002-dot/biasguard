import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import BiasHeatmap from './components/BiasHeatmap';
import BiasFindings from './components/BiasFindings';
import MitigationSimulator from './components/MitigationSimulator';
import BiasBounty from './components/BiasBounty';
import AuditReport from './components/AuditReport';
import StatsAnalytics from './components/StatsAnalytics';
import DemoGuideModal from './components/DemoGuideModal';
import Papa from 'papaparse';

// Built-in fallback demo CSV
const DEFAULT_DEMO_CSV = `Candidate_ID,Gender,Age,Education,Experience_Years,Test_Score,Selected
CAND_101,Female,28,Master,4,84,No
CAND_102,Male,34,Bachelor,6,76,Yes
CAND_103,Male,29,Master,3,89,Yes
CAND_104,Female,23,Bachelor,2,68,No
CAND_105,Non-Binary,31,Bachelor,5,79,No
CAND_106,Male,42,PhD,14,92,Yes
CAND_107,Female,36,Master,8,85,No
CAND_108,Male,27,Bachelor,4,74,Yes
CAND_109,Female,30,PhD,6,90,Yes
CAND_110,Male,38,Master,9,82,Yes
CAND_111,Female,46,Bachelor,12,71,No
CAND_112,Non-Binary,24,Bachelor,1,70,No
CAND_113,Male,31,Master,5,86,Yes
CAND_114,Female,37,Bachelor,7,80,No
CAND_115,Male,25,Bachelor,2,75,Yes
CAND_116,Female,29,Master,4,87,No
CAND_117,Male,39,PhD,11,91,Yes
CAND_118,Female,22,Bachelor,1,64,No
CAND_119,Male,28,Bachelor,3,78,Yes
CAND_120,Non-Binary,35,Master,7,84,No
CAND_121,Female,48,PhD,15,88,Yes
CAND_122,Male,30,Master,5,80,Yes
CAND_123,Female,32,Bachelor,4,77,No
CAND_124,Male,36,Bachelor,8,81,Yes
CAND_125,Female,35,Master,6,83,No
CAND_126,Male,24,Bachelor,2,70,No
CAND_127,Non-Binary,29,Master,4,79,No
CAND_128,Female,31,PhD,5,86,Yes
CAND_129,Male,49,Bachelor,16,77,Yes
CAND_130,Female,23,Bachelor,1,65,No
CAND_131,Male,28,Master,4,85,Yes
CAND_132,Female,38,Bachelor,8,78,No
CAND_133,Male,37,PhD,12,94,Yes
CAND_134,Female,33,Master,3,81,No
CAND_135,Non-Binary,44,Bachelor,11,72,No
CAND_136,Male,32,Bachelor,5,83,Yes
CAND_137,Female,47,Master,13,89,Yes
CAND_138,Male,26,Bachelor,2,72,Yes
CAND_139,Female,30,Bachelor,4,78,No
CAND_140,Male,35,Master,7,86,Yes`;

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
    targetColumn: 'Selected',
    protectedColumn: 'Gender',
    positiveValue: 'Yes',
    groundTruthColumn: 'Test_Score',
  });

  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bountyPrefill, setBountyPrefill] = useState(null);

  // Demo Tour State
  const [demoTourOpen, setDemoTourOpen] = useState(false);
  const [demoTourStep, setDemoTourStep] = useState(1);

  // Client-side Fairness Calculation Engine
  const runClientAudit = (records, cfg) => {
    const { targetColumn, protectedColumn, positiveValue, groundTruthColumn } = cfg;
    const groups = {};
    const posValStr = String(positiveValue || 'Yes').trim().toLowerCase();
    const truthCol = groundTruthColumn || 'Test_Score';

    const checkIsPositive = (val) => {
      if (val === undefined || val === null) return false;
      const v = String(val).trim().toLowerCase();
      if (v === posValStr) return true;
      if (posValStr === 'yes' && (v === 'yes' || v === '1' || v === 'true' || v === 'selected' || v === 'approved')) return true;
      if (posValStr === '1' && (v === '1' || v === 'yes' || v === 'true')) return true;
      return false;
    };

    records.forEach((row) => {
      const g = String(row[protectedColumn] || '').trim();
      if (!g) return;
      if (!groups[g]) groups[g] = { group: g, total: 0, positiveCount: 0, tp: 0, fp: 0, tn: 0, fn: 0 };
      groups[g].total++;

      const isPos = checkIsPositive(row[targetColumn]);
      if (isPos) groups[g].positiveCount++;

      const rawTruth = row[truthCol];
      let isTruthPos = false;
      if (rawTruth !== undefined && !isNaN(Number(rawTruth))) {
        isTruthPos = Number(rawTruth) >= 75;
      } else {
        isTruthPos = checkIsPositive(rawTruth);
      }

      if (isPos && isTruthPos) groups[g].tp++;
      else if (isPos && !isTruthPos) groups[g].fp++;
      else if (!isPos && !isTruthPos) groups[g].tn++;
      else if (!isPos && isTruthPos) groups[g].fn++;
    });

    const groupNames = Object.keys(groups);
    if (groupNames.length === 0) return null;

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
          evidence: `Positive selection rate is ${(posRate * 100).toFixed(1)}% vs ${(refRate * 100).toFixed(1)}% for reference group (${refGroup}).`,
          explanation: `The selection rate for group "${name}" falls below the 80% four-fifths fairness guideline. Potential disparity detected — further investigation recommended. Disparity does not automatically prove intentional discrimination.`,
          investigationGuide: `Review candidate qualification weighting, proxy correlates with ${protectedColumn}, and decision cutoff thresholds.`,
        });
      }

      if (fnr > 0.35) {
        findings.push({
          id: `fnr-${name}`,
          severity: fnr > 0.5 ? 'High' : 'Moderate',
          category: 'Outcome Fairness Disparity',
          metric: 'False Negative Rate (FNR)',
          affectedGroup: name,
          metricValue: `${(fnr * 100).toFixed(1)}%`,
          evidence: `False Negative Rate is ${(fnr * 100).toFixed(1)}%, indicating qualified candidates were rejected.`,
          explanation: `Qualified candidates from group "${name}" have a disproportionately high rejection rate, violating Equal Opportunity balance.`,
          investigationGuide: `Calibrate subgroup score thresholds to equalize error distribution across demographic cohorts.`,
        });
      }

      if (g.total < 10) {
        findings.push({
          id: `sample-${name}`,
          severity: 'Low',
          category: 'Representation Disparity',
          metric: 'Sample Representation',
          affectedGroup: name,
          metricValue: `${g.total} samples`,
          evidence: `Cohort contains only ${g.total} observations in the evaluation dataset.`,
          explanation: `Small sample size detected for "${name}". Results should be interpreted cautiously due to small sample variance.`,
          investigationGuide: `Collect more representative test evaluations for this demographic group.`,
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
          throw new Error('Fallback to local parsing');
        }
      } catch (e) {
        const parsed = Papa.parse(DEFAULT_DEMO_CSV, { header: true, skipEmptyLines: true });
        records = parsed.data;
        cols = Object.keys(records[0] || {});
        cols.forEach((c) => {
          colTypes[c] = ['Candidate_ID', 'Age', 'Experience_Years', 'Test_Score'].includes(c) ? 'numeric' : 'categorical';
        });
      }

      setDatasetState({
        data: records,
        columns: cols,
        columnTypes: colTypes,
        isDemo: true,
        fileName: 'biasguard_test_dataset.csv',
      });

      const demoConfig = {
        targetColumn: 'Selected',
        protectedColumn: 'Gender',
        positiveValue: 'Yes',
        groundTruthColumn: 'Test_Score',
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

  // Execute Audit
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
        // Fallback to local calculation
      }

      if (!result) {
        result = runClientAudit(datasetState.data, config);
      }

      setAuditData(result);
      setActiveTab('fairness');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Audit calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Auto load demo on initial startup
  useEffect(() => {
    handleLoadDemo(true);
  }, []);

  // Guided demo pitch steps
  const handleActionStep = (stepNum, targetTab) => {
    if (stepNum === 1) {
      handleLoadDemo(false);
      setActiveTab('dashboard');
    } else if (stepNum === 2) {
      handleRunAudit();
    } else {
      setActiveTab(targetTab === 'heatmap' ? 'fairness' : targetTab);
    }
  };

  const handleNavigateToBountyFromFinding = (finding) => {
    setBountyPrefill(finding);
    setActiveTab('bounty');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar with all 8 functional tabs */}
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
              setActiveTab('fairness');
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

        {(activeTab === 'fairness' || activeTab === 'heatmap') && (
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
          <AuditReport 
            auditData={auditData} 
            onLoadDemo={() => handleLoadDemo(true)} 
          />
        )}

        {activeTab === 'stats' && (
          <StatsAnalytics
            dataset={datasetState.data}
            columns={datasetState.columns}
            columnTypes={datasetState.columnTypes}
            auditData={auditData}
            onLoadDemo={() => handleLoadDemo(true)}
            onGoToDashboard={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Interactive Hackathon Demo Modal */}
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
