#!/usr/bin/env node
/**
 * Full-stack QA JSON: backend Jest, SQLite checks, frontend Playwright (API+Next stack).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const blogApiDir = path.join(root, 'blog-api');
const blogappDir = path.join(root, 'blogapp');

const apiReportPath = path.join(blogApiDir, 'test-report.json');
const dbReportPath = path.join(blogApiDir, 'database-qa-report.json');
const feReportPath = path.join(blogappDir, 'e2e-qa-report.json');
const outPath = path.join(root, 'qa-report-all.json');
const { bugFieldsForExport } = require('./bug-export-fields');

function run(cmd, args, cwd, envOverrides) {
  const env = envOverrides ? { ...process.env, ...envOverrides } : process.env;
  return spawnSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    env,
    shell: process.platform === 'win32'
  });
}

function readJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/**
 * One flat row per automated case: Excel-style test columns + bug-tracking fields (template).
 * @param {string} layer 'blog-api' | 'database' | 'blogapp'
 * @param {object} r row from testResults[]
 */
function flatRow(layer, r) {
  const bugs = bugFieldsForExport(r.bug, r.status);
  return {
    layer,
    Module: r.module,
    'Test Case ID': r.testCaseId,
    'Test Title': r.testTitle,
    Technique: r.technique,
    'Pre-conditions': r.preConditions,
    'Test Steps': r.testSteps,
    'Test Data': r.testData,
    'Expected Result': r.expectedResult,
    'Actual Result': r.actualResult,
    Status: r.status,
    'Post-conditions': r.postConditions,
    classification: r.classification,
    positiveTrue: r.positiveTrue,
    positiveFalse: r.positiveFalse,
    ...bugs
  };
}

function collectAllRows(blogApiReport, databaseReport, blogappReport) {
  const rows = [];
  for (const r of blogApiReport.testResults || []) {
    rows.push(flatRow('blog-api (API / backend)', r));
  }
  for (const r of databaseReport.testResults || []) {
    rows.push(flatRow('database (SQLite)', r));
  }
  for (const r of blogappReport.testResults || []) {
    rows.push(flatRow('blogapp (frontend E2E)', r));
  }
  return rows;
}

function main() {
  if (!fs.existsSync(path.join(blogApiDir, 'node_modules'))) {
    console.error('Missing blog-api/node_modules. Run: cd blog-api && npm install');
    process.exit(1);
  }
  if (!fs.existsSync(path.join(blogappDir, 'node_modules'))) {
    console.error('Missing blogapp/node_modules. Run: cd blogapp && npm install');
    process.exit(1);
  }
  if (!fs.existsSync(path.join(blogappDir, 'node_modules', '@playwright', 'test'))) {
    console.error('Missing @playwright/test. Run: cd blogapp && npm install && npx playwright install chromium');
    process.exit(1);
  }

  const apiProc = run('npm', ['run', 'test:report'], blogApiDir);
  if (!fs.existsSync(apiReportPath)) {
    console.error(apiProc.stdout || '', apiProc.stderr || '');
    console.error('Missing', apiReportPath);
    process.exit(apiProc.status !== 0 ? apiProc.status : 1);
  }

  const dbProc = run('npm', ['run', 'test:report:db'], blogApiDir);
  if (!fs.existsSync(dbReportPath)) {
    console.error(dbProc.stdout || '', dbProc.stderr || '');
    console.error('Missing', dbReportPath);
    process.exit(dbProc.status !== 0 ? dbProc.status : 1);
  }

  const feOverrides =
    process.env.CI || process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '0'
      ? {}
      : { PLAYWRIGHT_USE_SYSTEM_CHROME: '1' };
  const feProc = run('npm', ['run', 'test:e2e:qa'], blogappDir, feOverrides);
  if (!fs.existsSync(feReportPath)) {
    console.error(feProc.stdout || '', feProc.stderr || '');
    console.error('Missing', feReportPath, '— try: cd blogapp && npx playwright install chromium');
    process.exit(feProc.status !== 0 ? feProc.status : 1);
  }

  const blogApiReport = readJson(apiReportPath);
  const databaseReport = readJson(dbReportPath);
  const blogappReport = readJson(feReportPath);

  if (!(blogappReport.testResults && blogappReport.testResults.length > 0)) {
    console.error('Frontend E2E report has no test rows. See blogapp/playwright output.');
    process.exit(feProc.status !== 0 && feProc.status !== null ? feProc.status : 1);
  }

  const sApi = blogApiReport.summary;
  const sDb = databaseReport.summary;
  const sFe = blogappReport.summary;

  const merged = {
    generatedAt: new Date().toISOString(),
    syllabusReference: 'run-test.md',
    reportFormat: {
      description:
        'Aligned with course QA deliverables (run-test.md): test case columns + defect log fields.',
      bugColumnsWhenTestPasses:
        'Defect columns apply when a test fails. When Status is Pass, only Bug Title shows a short line ("No defect (test passed)"); other bug cells are left blank to avoid repeating N/A.',
      testCaseColumns: [
        'Module',
        'Test Case ID',
        'Test Title',
        'Technique',
        'Pre-conditions',
        'Test Steps',
        'Test Data',
        'Expected Result',
        'Actual Result',
        'Status',
        'Post-conditions'
      ],
      bugTrackingColumns: [
        'Bug ID',
        'Bug Title',
        'Severity',
        'Priority',
        'Environment',
        'Steps to Reproduce',
        'Expected Result (bug)',
        'Actual Result (bug)',
        'Evidence',
        'Bug Status'
      ],
      severityGuide: {
        Critical: 'Crash / Data Loss',
        Major: 'Main feature broken',
        Minor: 'UI glitch / Typo'
      },
      priorityGuide: {
        P1: 'Fix immediately',
        P2: 'Fix before next release',
        P3: 'Low priority'
      },
      bugStatusGuide: ['New', 'Open', 'Fixed', 'Verified']
    },
    environment: {
      backend: blogApiReport.environment,
      database: databaseReport.environment,
      frontendE2E: blogappReport.environment
    },
    blogApi: blogApiReport,
    database: databaseReport,
    blogapp: blogappReport,
    allRows: collectAllRows(blogApiReport, databaseReport, blogappReport),
    summary: {
      packagesIncluded: ['blog-api', 'blog-api/database', 'blogapp'],
      total: sApi.total + sDb.total + sFe.total,
      passed: sApi.passed + sDb.passed + sFe.passed,
      failed: sApi.failed + sDb.failed + sFe.failed,
      jestApiSuccess: sApi.jestSuccess === true,
      databaseChecksSuccess: sDb.dbChecksSuccess === true,
      playwrightSuccess: sFe.playwrightSuccess === true,
      overallSuccess:
        sApi.jestSuccess === true && sDb.dbChecksSuccess === true && sFe.playwrightSuccess === true,
      positiveTrueOutcomePass:
        (sApi.positiveTrueOutcomePass || 0) +
        (sDb.positiveTrueOutcomePass || 0) +
        (sFe.positiveTrueOutcomePass || 0),
      positiveFalseOutcomePass:
        (sApi.positiveFalseOutcomePass || 0) +
        (sDb.positiveFalseOutcomePass || 0) +
        (sFe.positiveFalseOutcomePass || 0)
    }
  };

  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
  process.stdout.write(JSON.stringify(merged, null, 2) + '\n');

  let exitCode = 0;
  if (apiProc.status) exitCode = apiProc.status;
  else if (dbProc.status) exitCode = dbProc.status;
  else if (feProc.status) exitCode = feProc.status;
  else if (!merged.summary.overallSuccess) exitCode = 1;
  process.exit(exitCode);
}

main();
