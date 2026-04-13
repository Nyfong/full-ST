'use strict';

/**
 * Reads playwright-report.json + e2e-report.manifest.json → e2e-qa-report.json
 * (same row shape as blog-api test-report.json).
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const playwrightPath = path.join(root, 'playwright-report.json');
const manifestPath = path.join(root, 'e2e-report.manifest.json');
const outFile = path.join(root, 'e2e-qa-report.json');

function loadJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/** @param {any} suite @param {string[]} prefix */
function walkSuite(suite, prefix, out) {
  const nextPrefix = [...prefix, suite.title].filter(Boolean);
  for (const child of suite.suites || []) {
    walkSuite(child, nextPrefix, out);
  }
  for (const spec of suite.specs || []) {
    const fullTitle = [...nextPrefix, spec.title].join(' › ');
    for (const t of spec.tests || []) {
      const res = t.results && t.results[0];
      const status = res ? res.status : 'skipped';
      const errMsg =
        res && res.error
          ? String(res.error.message || res.error)
          : res && res.errors && res.errors.length
            ? res.errors.map((e) => e.message).join('\n')
            : '';
      out.push({ fullTitle, status, errMsg });
    }
  }
}

function flattenPlaywright(json) {
  const out = [];
  for (const s of json.suites || []) {
    walkSuite(s, [], out);
  }
  return out;
}

function buildBugRecord(passed, errMsg, meta, envDefault) {
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
  return {
    bugId: `BUG-${meta.testCaseId}`,
    bugTitle: `E2E failure: ${meta.testTitle}`,
    severity: 'Major',
    priority: 'P2',
    environment: envDefault,
    stepsToReproduce: meta.testSteps,
    expectedResult: meta.expectedResult,
    actualResult: errMsg || 'Playwright assertion failure',
    evidence: '[Attach trace / screenshot / playwright-report.json]',
    status: 'Open'
  };
}

function main() {
  const manifest = loadJson(manifestPath) || { cases: {}, environmentDefault: '' };
  const envDefault = manifest.environmentDefault || 'Playwright E2E';
  const cases = manifest.cases || {};

  const pw = loadJson(playwrightPath);
  if (!pw) {
    console.error('Missing', playwrightPath, '— run playwright test first');
    process.exit(1);
  }

  const flat = flattenPlaywright(pw);
  const testResults = flat.map(function (row) {
    const meta = cases[row.fullTitle] || {
      module: 'Frontend (E2E)',
      testCaseId: 'TC-FE-UNMAPPED',
      testTitle: row.fullTitle,
      technique: 'Playwright',
      preConditions: '',
      testSteps: '',
      testData: '',
      expectedResult: '',
      postConditions: '',
      classification: 'positive_true'
    };

    const passed = row.status === 'passed';
    const classification = meta.classification === 'positive_false' ? 'positive_false' : 'positive_true';
    const positiveTrue = classification === 'positive_true' ? passed : false;
    const positiveFalse = classification === 'positive_false' ? passed : false;

    const actualResult = passed
      ? classification === 'positive_false'
        ? 'Negative / security expectation met (redirect or rejection).'
        : 'Playwright assertions passed.'
      : row.errMsg || 'Failed';

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
      jestStatus: passed ? 'passed' : 'failed',
      playwrightStatus: row.status,
      durationMs: null,
      bug: buildBugRecord(passed, row.errMsg, meta, envDefault)
    };
  });

  const passed = testResults.filter((r) => r.status === 'Pass').length;
  const failed = testResults.filter((r) => r.status === 'Fail').length;

  const report = {
    generatedAt: new Date().toISOString(),
    source: 'blogapp Playwright + e2e-report.manifest.json',
    environment: envDefault,
    summary: {
      total: testResults.length,
      passed,
      failed,
      playwrightSuccess: failed === 0,
      positiveTrueAssertions: testResults.filter((r) => r.classification === 'positive_true').length,
      positiveFalseAssertions: testResults.filter((r) => r.classification === 'positive_false').length,
      positiveTrueOutcomePass: testResults.filter((r) => r.positiveTrue === true).length,
      positiveFalseOutcomePass: testResults.filter((r) => r.positiveFalse === true).length
    },
    testResults
  };

  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf8');
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}

main();
