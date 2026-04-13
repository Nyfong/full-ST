#!/usr/bin/env node
/**
 * Runs Jest with JSON output and merges each assertion with QA manifest fields
 * (Excel-style test case columns + bug template). Writes report to stdout and file.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const manifestPath = path.join(root, 'test-report.manifest.json');
const outFile = path.join(root, 'test-report.json');
const jestJsonPath = path.join(root, '.jest-report-output.json');

function loadManifest() {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  return JSON.parse(raw);
}

function runJestJson() {
  const jestCli = require.resolve('jest-cli/bin/jest');
  return spawnSync(process.execPath, [jestCli, '--runInBand', '--json', `--outputFile=${jestJsonPath}`], {
    cwd: root,
    encoding: 'utf8',
    env: process.env
  });
}

function buildBugRecord(passed, failureMessages, meta, envDefault) {
  if (passed) {
    return {
      bugId: null,
      bugTitle: null,
      severity: null,
      priority: null,
      environment: null,
      stepsToReproduce: null,
      expectedResult: null,
      actualResult: null,
      evidence: null,
      status: null
    };
  }
  const actual = (failureMessages && failureMessages[0]) || 'Test failed (no message)';
  return {
    bugId: `BUG-${meta.testCaseId}`,
    bugTitle: `Automated failure: ${meta.testTitle}`,
    severity: meta.classification === 'positive_true' ? 'Major' : 'Major',
    priority: 'P2',
    environment: envDefault,
    stepsToReproduce: meta.testSteps,
    expectedResult: meta.expectedResult,
    actualResult: actual.trim(),
    evidence: '[Attach CI log / Jest output / screenshot]',
    status: 'Open'
  };
}

function rowFromAssertion(assertion, cases, envDefault) {
  const fullName = assertion.fullName;
  const meta = cases[fullName] || {
    module: assertion.ancestorTitles[0] || 'Unknown',
    testCaseId: fullName.replace(/\s+/g, '-'),
    testTitle: assertion.title,
    technique: 'Not mapped in test-report.manifest.json',
    preConditions: '',
    testSteps: '',
    testData: '',
    expectedResult: '',
    postConditions: '',
    classification: 'positive_true'
  };

  const passed = assertion.status === 'passed';
  const classification = meta.classification === 'positive_false' ? 'positive_false' : 'positive_true';

  const positiveTrue = classification === 'positive_true' ? passed : false;
  const positiveFalse = classification === 'positive_false' ? passed : false;

  const actualResult = passed
    ? (classification === 'positive_false'
      ? 'Request correctly rejected (e.g. 401) as specified.'
      : 'Assertions matched expected API behavior.')
    : (assertion.failureMessages && assertion.failureMessages[0]) || 'Failed';

  const bug = buildBugRecord(passed, assertion.failureMessages, { ...meta, classification }, envDefault);

  return {
    module: meta.module,
    testCaseId: meta.testCaseId,
    testTitle: meta.testTitle,
    technique: meta.technique,
    preConditions: meta.preConditions,
    testSteps: meta.testSteps,
    testData: meta.testData,
    expectedResult: meta.expectedResult,
    actualResult,
    status: passed ? 'Pass' : 'Fail',
    postConditions: meta.postConditions,
    classification,
    positiveTrue,
    positiveFalse,
    jestStatus: assertion.status,
    durationMs: assertion.duration,
    bug
  };
}

function main() {
  const manifest = loadManifest();
  const envDefault = manifest.environmentDefault || 'Local';
  const cases = manifest.cases || {};

  const spawnResult = runJestJson();
  if (!fs.existsSync(jestJsonPath)) {
    console.error('Jest did not write JSON output to', jestJsonPath);
    process.exit(spawnResult.status !== 0 ? spawnResult.status : 1);
  }

  const jestReport = JSON.parse(fs.readFileSync(jestJsonPath, 'utf8'));
  try {
    fs.unlinkSync(jestJsonPath);
  } catch (_) {
    /* ignore */
  }

  const rows = [];
  for (const suite of jestReport.testResults || []) {
    for (const assertion of suite.assertionResults || []) {
      rows.push(rowFromAssertion(assertion, cases, envDefault));
    }
  }

  const passed = rows.filter((r) => r.status === 'Pass').length;
  const failed = rows.filter((r) => r.status === 'Fail').length;

  const report = {
    generatedAt: new Date().toISOString(),
    source: 'blog-api Jest integration tests + test-report.manifest.json',
    syllabusReference: 'run-test.md (course QA lifecycle)',
    environment: envDefault,
    summary: {
      total: rows.length,
      passed,
      failed,
      jestSuccess: jestReport.success === true,
      positiveTrueAssertions: rows.filter((r) => r.classification === 'positive_true').length,
      positiveFalseAssertions: rows.filter((r) => r.classification === 'positive_false').length,
      positiveTrueOutcomePass: rows.filter((r) => r.positiveTrue === true).length,
      positiveFalseOutcomePass: rows.filter((r) => r.positiveFalse === true).length
    },
    testResults: rows
  };

  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf8');
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');

  if (spawnResult.status !== 0) {
    process.exit(spawnResult.status);
  }
}

main();
