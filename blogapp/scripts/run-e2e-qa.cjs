'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

const env = {
  ...process.env,
  ...(process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === undefined
    ? { PLAYWRIGHT_USE_SYSTEM_CHROME: '1' }
    : {})
};

const pw = spawnSync('npx', ['playwright', 'test'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env
});

spawnSync(process.execPath, [path.join(root, 'scripts', 'merge-e2e-qa-report.cjs')], {
  cwd: root,
  stdio: 'inherit'
});

process.exit(pw.status !== 0 && pw.status !== null ? pw.status : 0);
