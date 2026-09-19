const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { runAudit } = require('./backend/src/audit');

const csvPath = path.join(__dirname, 'demo-data', 'biasguard_test_dataset.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const records = parse(content, { columns: true, skip_empty_lines: true, trim: true });

console.log('--- 1. Testing Dataset Parsing ---');
console.log(`Loaded ${records.length} records successfully.`);
console.log('Columns:', Object.keys(records[0]));

console.log('\n--- 2. Executing Real Audit Calculation Engine ---');
const config = {
  targetColumn: 'Selected',
  protectedColumn: 'Gender',
  positiveValue: 'Yes',
  groundTruthColumn: 'Test_Score'
};

const result = runAudit(records, config);

console.log('\n--- 3. Group Statistics & Disparity Metrics ---');
console.table(result.groupMetrics);

console.log('\n--- 4. Overall Fairness Score ---');
console.log(`Fairness Score: ${result.fairnessScore} / 100`);

console.log('\n--- 5. Generated Algorithmic Bias Findings ---');
console.log(JSON.stringify(result.findings, null, 2));

console.log('\n[PASS] All backend audit calculations completed successfully!');
