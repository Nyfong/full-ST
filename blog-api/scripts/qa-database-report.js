#!/usr/bin/env node
/**
 * SQLite health & schema checks → database-qa-report.json (same row shape as API test report).
 */

const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const root = path.join(__dirname, '..');
const manifestPath = path.join(root, 'database-report.manifest.json');
const outFile = path.join(root, 'database-qa-report.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const envDefault = manifest.environmentDefault || 'SQLite';
const cases = manifest.cases || {};

/** @typedef {{ ok: boolean, message: string }} CheckResult */

/** @type {Record<string, () => CheckResult>} */
const runners = {
  'DB-INT-001': function integrity() {
    const db = require('../db');
    const row = db.pragma('integrity_check', { simple: true });
    const ok = row === 'ok';
    return { ok, message: ok ? 'integrity_check: ok' : String(row) };
  },
  'DB-SCH-001': function usersCols() {
    const db = require('../db');
    const cols = db.pragma('table_info(users)').map((c) => c.name);
    const need = ['id', 'name', 'email', 'passwordHash', 'createdAt'];
    const missing = need.filter((n) => !cols.includes(n));
    const ok = missing.length === 0;
    return { ok, message: ok ? 'users columns OK' : 'Missing: ' + missing.join(', ') };
  },
  'DB-SCH-002': function postsCols() {
    const db = require('../db');
    const cols = db.pragma('table_info(posts)').map((c) => c.name);
    const need = ['id', 'title', 'content', 'authorId', 'createdAt', 'updatedAt'];
    const missing = need.filter((n) => !cols.includes(n));
    const fkList = db.pragma('foreign_key_list(posts)');
    const fk = fkList.some((fk) => fk.table === 'users' && String(fk.from) === 'authorId');
    const ok = missing.length === 0 && fk;
    let msg = missing.length ? 'Missing: ' + missing.join(', ') : 'posts columns OK';
    if (!fk) msg += '; pragma foreign_key_list(posts) does not show users(authorId) — recreate blog.db from current schema if needed';
    return { ok, message: msg };
  },
  'DB-DATA-001': function noOrphans() {
    const db = require('../db');
    const row = db
      .prepare(
        `SELECT COUNT(*) AS n FROM posts p
         LEFT JOIN users u ON u.id = p.authorId
         WHERE u.id IS NULL`
      )
      .get();
    const n = row.n;
    const ok = n === 0;
    return { ok, message: ok ? 'No orphan posts' : `Found ${n} orphan post(s)` };
  },
  'DB-NEG-001': function rejectBadFk() {
    const db = require('../db');
    const fakeAuthor = randomUUID();
    try {
      db.prepare(
        `INSERT INTO posts (id, title, content, authorId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`
      ).run(randomUUID(), 'x', 'y', fakeAuthor);
      return { ok: false, message: 'Insert succeeded but should have been rejected (FK)' };
    } catch (e) {
      const msg = String(e.message || e);
      const ok = /FOREIGN KEY|SQLITE_CONSTRAINT/i.test(msg);
      return { ok, message: ok ? 'FK rejected invalid authorId: ' + msg : 'Unexpected error: ' + msg };
    }
  }
};

function buildBugRecord(passed, message, meta) {
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
    bugTitle: `Database check failed: ${meta.testTitle}`,
    severity: 'Critical',
    priority: 'P1',
    environment: envDefault,
    stepsToReproduce: meta.testSteps,
    expectedResult: meta.expectedResult,
    actualResult: message,
    evidence: '[Attach database-qa-report.json / server logs]',
    status: 'Open'
  };
}

function rowForCase(id) {
  const meta = cases[id];
  if (!meta) throw new Error('Unknown case id: ' + id);
  const run = runners[id];
  if (!run) throw new Error('No runner for case id: ' + id);

  let passed = false;
  let message = '';
  try {
    const r = run();
    passed = r.ok;
    message = r.message;
  } catch (e) {
    passed = false;
    message = String(e.stack || e.message || e);
  }

  const classification = meta.classification === 'positive_false' ? 'positive_false' : 'positive_true';
  const positiveTrue = classification === 'positive_true' ? passed : false;
  const positiveFalse = classification === 'positive_false' ? passed : false;

  const actualResult = passed
    ? classification === 'positive_false'
      ? 'Negative check behaved as expected (constraint / error).'
      : message
    : message;

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
    durationMs: null,
    bug: buildBugRecord(passed, message, meta)
  };
}

function main() {
  const order = ['DB-INT-001', 'DB-SCH-001', 'DB-SCH-002', 'DB-DATA-001', 'DB-NEG-001'];
  const testResults = order.map(rowForCase);
  const passed = testResults.filter((r) => r.status === 'Pass').length;
  const failed = testResults.filter((r) => r.status === 'Fail').length;

  const report = {
    generatedAt: new Date().toISOString(),
    source: 'blog-api SQLite (db.js) + database-report.manifest.json',
    environment: envDefault,
    summary: {
      total: testResults.length,
      passed,
      failed,
      dbChecksSuccess: failed === 0,
      positiveTrueAssertions: testResults.filter((r) => r.classification === 'positive_true').length,
      positiveFalseAssertions: testResults.filter((r) => r.classification === 'positive_false').length,
      positiveTrueOutcomePass: testResults.filter((r) => r.positiveTrue === true).length,
      positiveFalseOutcomePass: testResults.filter((r) => r.positiveFalse === true).length
    },
    testResults
  };

  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), 'utf8');
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(failed > 0 ? 1 : 0);
}

main();
