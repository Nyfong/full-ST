'use strict';

/**
 * 1) next build (production; avoids "another next dev" lock if you have next dev open)
 * 2) blog-api on 5055
 * 3) next start on 3055
 * Playwright sends SIGTERM when tearing down webServer.
 */

const { spawn, spawnSync } = require('child_process');
const path = require('path');
const http = require('http');

const blogappRoot = path.join(__dirname, '..');
const apiRoot = path.join(blogappRoot, '..', 'blog-api');

let apiProc = null;
let webProc = null;

function waitGet(url, maxMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function once() {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) resolve();
        else schedule();
      });
      req.on('error', schedule);
      function schedule() {
        if (Date.now() - start > maxMs) reject(new Error('Timeout waiting for ' + url));
        else setTimeout(once, 400);
      }
    }
    once();
  });
}

function shutdown() {
  if (webProc) {
    try {
      webProc.kill('SIGTERM');
    } catch (_) {}
    webProc = null;
  }
  if (apiProc) {
    try {
      apiProc.kill('SIGTERM');
    } catch (_) {}
    apiProc = null;
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const build = spawnSync('npm', ['run', 'build'], {
  cwd: blogappRoot,
  env: {
    ...process.env,
    NEXT_PUBLIC_API_URL: 'http://127.0.0.1:5055'
  },
  stdio: 'inherit'
});

if (build.status !== 0) {
  console.error('[e2e-stack] next build failed. Stop any other `next dev` using this folder if the build was locked.');
  process.exit(build.status || 1);
}

apiProc = spawn(process.execPath, [path.join(apiRoot, 'bin', 'www')], {
  cwd: apiRoot,
  env: { ...process.env, PORT: '5055' },
  stdio: 'inherit'
});

apiProc.on('exit', () => {
  apiProc = null;
  if (webProc) webProc.kill('SIGTERM');
});

waitGet('http://127.0.0.1:5055/api/v1/health', 120000)
  .then(() => {
    const nextBin = path.join(blogappRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
    webProc = spawn(process.execPath, [nextBin, 'start', '-p', '3055', '-H', '127.0.0.1'], {
      cwd: blogappRoot,
      env: {
        ...process.env,
        NEXT_PUBLIC_API_URL: 'http://127.0.0.1:5055',
        PORT: '3055',
        HOSTNAME: '127.0.0.1'
      },
      stdio: 'inherit'
    });
    webProc.on('exit', () => {
      webProc = null;
      if (apiProc) apiProc.kill('SIGTERM');
    });
  })
  .catch((err) => {
    console.error(err);
    shutdown();
    process.exit(1);
  });
