import { DIST, PORT } from './env.mjs';
// Runs the browser suites against a built dist/.
//
// Each suite is a standalone script that prints "N passed, M failed" (or, for
// the sweeps, a total). They run in separate processes so one crash cannot take
// the rest down, and sequentially because they share one static server and one
// port.
//
// Usage:  npm run test:browser            all suites
//         npm run test:browser -- search  only suites whose name matches
import { spawn } from 'node:child_process';
import { readdirSync, existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const filter = process.argv.slice(2).filter((a) => !a.startsWith('-'));

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(2);
}

// The WCAG suite injects axe-core, and the page's CSP only allows same-origin
// scripts, so it has to be served out of dist/ rather than added inline.
const require = createRequire(import.meta.url);
try {
  const axe = require.resolve('axe-core/axe.min.js');
  mkdirSync(DIST, { recursive: true });
  copyFileSync(axe, join(DIST, 'axe.min.js'));
} catch {
  console.error('axe-core is not installed; the accessibility suite will fail.');
}

const suites = readdirSync(HERE)
  .filter((f) => f.endsWith('.mjs') && !['env.mjs', 'run.mjs', 'server.mjs'].includes(f))
  .filter((f) => !filter.length || filter.some((q) => f.includes(q)))
  .sort();

if (!suites.length) { console.error('No suites matched', filter); process.exit(2); }

const server = spawn(process.execPath, [join(HERE, 'server.mjs')], { stdio: 'ignore' });
const stop = () => { try { server.kill(); } catch { /* already gone */ } };
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });

await new Promise((r) => setTimeout(r, 700));   // let the listener bind

let failedSuites = 0, totalPass = 0, totalFail = 0;
for (const suite of suites) {
  const out = await new Promise((resolve) => {
    let buf = '';
    const child = spawn(process.execPath, [join(HERE, suite)], { env: { ...process.env, PORT: String(PORT) } });
    child.stdout.on('data', (d) => { buf += d; });
    child.stderr.on('data', (d) => { buf += d; });
    child.on('close', (code) => resolve({ buf, code }));
  });
  const m = out.buf.match(/(\d+) passed, (\d+) failed/);
  let line, ok;
  if (m) {
    totalPass += +m[1]; totalFail += +m[2];
    ok = +m[2] === 0 && out.code === 0;
    line = `${m[1]} passed, ${m[2]} failed`;
  } else {
    // A suite that prints no result line is a crash, not a pass.
    ok = false;
    line = `no result line (exit ${out.code})`;
  }
  if (!ok) { failedSuites++; console.log(out.buf.trimEnd()); }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${suite.replace('.mjs', '').padEnd(24)} ${line}`);
}
stop();
console.log(`\n${suites.length - failedSuites}/${suites.length} suites passed` +
  (totalPass + totalFail ? `  (${totalPass} assertions passed, ${totalFail} failed)` : ''));
process.exit(failedSuites ? 1 : 0);
