/**
 * Bug-tracking columns for Excel/JSON export.
 * When a test passes: only Bug Title gets a short note; other defect columns stay empty
 * (no repeated "N/A" across the row).
 */

const empty = '';

/**
 * @param {object|null|undefined} b bug object from report row
 * @param {string} status row Status e.g. Pass | Fail
 */
function bugFieldsForExport(b, status) {
  const bug = b || {};
  if (bug.bugId != null && bug.bugId !== '') {
    return {
      'Bug ID': bug.bugId,
      'Bug Title': bug.bugTitle,
      Severity: bug.severity,
      Priority: bug.priority,
      Environment: bug.environment,
      'Steps to Reproduce': bug.stepsToReproduce,
      'Expected Result (bug)': bug.expectedResult,
      'Actual Result (bug)': bug.actualResult,
      Evidence: bug.evidence,
      'Bug Status': bug.status
    };
  }

  const title =
    status === 'Pass'
      ? 'No defect (test passed)'
      : 'No defect entry (see test Actual Result)';

  return {
    'Bug ID': empty,
    'Bug Title': title,
    Severity: empty,
    Priority: empty,
    Environment: empty,
    'Steps to Reproduce': empty,
    'Expected Result (bug)': empty,
    'Actual Result (bug)': empty,
    Evidence: empty,
    'Bug Status': empty
  };
}

module.exports = { bugFieldsForExport };
