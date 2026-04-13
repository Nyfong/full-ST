#!/usr/bin/env node
/**
 * Converts qa-report-all.json → qa-report-all.xlsx (multi-sheet workbook).
 * Requires: npm install (exceljs at repo root)
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'qa-report-all.json');
const outPath = path.join(root, 'qa-report-all.xlsx');
const { bugFieldsForExport } = require('./bug-export-fields');

function cellValue(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return JSON.stringify(v);
  return v;
}

function addRowsFromObjects(worksheet, rows) {
  if (!rows || !rows.length) {
    worksheet.addRow(['(no rows)']);
    return;
  }
  const headers = Object.keys(rows[0]);
  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  for (const r of rows) {
    worksheet.addRow(headers.map((h) => cellValue(r[h])));
  }
  headers.forEach((h, i) => {
    worksheet.getColumn(i + 1).width = Math.min(60, Math.max(12, String(h).length + 2));
  });
}

function flattenTestResults(report, layerLabel) {
  const out = [];
  for (const r of report.testResults || []) {
    const bugs = bugFieldsForExport(r.bug, r.status);
    out.push({
      layer: layerLabel,
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
      ...bugs
    });
  }
  return out;
}

async function main() {
  let ExcelJS;
  try {
    ExcelJS = require('exceljs');
  } catch {
    console.error('Missing exceljs. Run from repo root: npm install');
    process.exit(1);
  }

  if (!fs.existsSync(jsonPath)) {
    console.error('Not found:', jsonPath, '\nRun: npm run qa-report');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  /** Re-fill bug columns when there is no real BUG-* id (null, empty, or old "N/A" export). */
  function normalizeAllRow(row) {
    const bid = row['Bug ID'];
    if (typeof bid === 'string' && bid.startsWith('BUG-')) return row;
    return { ...row, ...bugFieldsForExport(null, row.Status || 'Pass') };
  }

  if (data.allRows && data.allRows.length) {
    data.allRows = data.allRows.map(normalizeAllRow);
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ST_final_project qa-json-to-xlsx';
  workbook.created = new Date();

  const wsMeta = workbook.addWorksheet('Summary');
  wsMeta.addRow(['Field', 'Value']);
  wsMeta.getRow(1).font = { bold: true };
  wsMeta.addRow(['generatedAt', data.generatedAt || '']);
  wsMeta.addRow(['syllabusReference', data.syllabusReference || '']);
  if (data.environment) {
    for (const [k, v] of Object.entries(data.environment)) {
      wsMeta.addRow([`environment.${k}`, cellValue(v)]);
    }
  }
  if (data.summary) {
    for (const [k, v] of Object.entries(data.summary)) {
      if (typeof v === 'object' && v !== null) {
        wsMeta.addRow([`summary.${k}`, JSON.stringify(v)]);
      } else {
        wsMeta.addRow([`summary.${k}`, v]);
      }
    }
  }
  wsMeta.getColumn(1).width = 28;
  wsMeta.getColumn(2).width = 70;

  const allRows = data.allRows;
  const wsAll = workbook.addWorksheet('All test cases');
  if (allRows && allRows.length) {
    addRowsFromObjects(wsAll, allRows);
  } else {
    wsAll.addRow(['(allRows missing — open JSON and re-run qa-report)']);
  }

  if (data.blogApi) {
    const ws = workbook.addWorksheet('API backend');
    addRowsFromObjects(ws, flattenTestResults(data.blogApi, 'blog-api'));
  }
  if (data.database) {
    const ws = workbook.addWorksheet('Database');
    addRowsFromObjects(ws, flattenTestResults(data.database, 'database'));
  }
  if (data.blogapp) {
    const ws = workbook.addWorksheet('Frontend E2E');
    addRowsFromObjects(ws, flattenTestResults(data.blogapp, 'blogapp'));
  }

  await workbook.xlsx.writeFile(outPath);
  console.log('Wrote', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
