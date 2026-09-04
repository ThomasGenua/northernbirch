import { DIST, PORT } from './env.mjs';
// Runs the browser suites against a built dist/.
//
// Each suite is a standalone script that prints "N passed, M failed" (or, for
// the sweeps, a total). They run in separate processes so one crash cannot take
// the rest down, and sequentially because they share one static server and one
// port.
//
// Usage:  npm run test:browser                 all suites
//         npm run test:browser -- search       only suites whose name matches
//         npm run test:browser -- --shard=2/4  the second quarter of them
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync, existsSync, copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const filter = args.filter((a) => !a.startsWith('-'));
const shardArg = args.find((a) => a.startsWith('--shard='));

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

let suites = readdirSync(HERE)
  .filter((f) => f.endsWith('.mjs') && !['env.mjs', 'run.mjs', 'server.mjs'].includes(f))
  .filter((f) => !filter.length || filter.some((q) => f.includes(q)))
  .sort();

if (!suites.length) { console.error('No suites matched', filter); process.exit(2); }

// --shard=i/n splits the suites across n machines, for CI's matrix. Not every
// nth file: the suites' runtimes span 6s to 4 minutes, so dealing them out in
// name order would leave one shard carrying most of the run and the rest idle.
// timings.json records what each one took, and the longest is placed first,
// each onto whichever shard is currently lightest.
//
// The split is over the directory listing, not over timings.json, so a suite
// missing from that file is still run by exactly one shard -- a stale table
// costs balance, never coverage. It is worth refreshing when the spread drifts:
//   WRITE_TIMINGS=tests/browser/timings.json npm run test:browser
if (shardArg) {
  const [index, total] = shardArg.slice('--shard='.length).split('/').map(Number);
  if (!Number.isInteger(index) || !Number.isInteger(total) || index < 1 || index > total) {
    console.error(`--shard=i/n needs whole numbers with 1 <= i <= n; got "${shardArg}"`);
    process.exit(2);
  }
  let recorded = {};
  try { recorded = JSON.parse(readFileSync(join(HERE, 'timings.json'), 'utf8')); } catch { /* fall through to the default */ }
  // Zero is a real measurement here, not a missing one: security-headers and
  // social only read files and finish inside the rounding. Treating 0 as
  // "unrecorded" would hand them the median and push a genuinely heavy suite
  // onto another shard to make room.
  const isRecorded = (s) => Number.isFinite(recorded[s]) && recorded[s] >= 0;
  const known = Object.keys(recorded).filter(isRecorded).map((s) => recorded[s]).sort((a, b) => a - b);
  // An unrecorded suite is assumed median-length: guessing zero would pile every
  // new suite onto one shard.
  const fallback = known.length ? known[known.length >> 1] : 1;
  const weight = (s) => (isRecorded(s) ? recorded[s] : fallback);

  const missing = suites.filter((s) => !isRecorded(s));
  if (missing.length) {
    const named = missing.length > 4 ? `${missing.length} suites` : missing.map((s) => s.replace('.mjs', '')).join(', ');
    console.log(`note: no recorded timing for ${named} -- assuming ${fallback}s each, so this split may be uneven`);
  }

  const bins = Array.from({ length: total }, () => ({ load: 0, suites: [] }));
  // Sorted by weight, then by name, so every shard computes the same partition.
  for (const s of [...suites].sort((a, b) => weight(b) - weight(a) || a.localeCompare(b))) {
    const lightest = bins.reduce((lo, b) => (b.load < lo.load ? b : lo));
    lightest.load += weight(s);
    lightest.suites.push(s);
  }
  suites = bins[index - 1].suites.sort();
  console.log(`shard ${index}/${total}: ${suites.length} of ${bins.reduce((n, b) => n + b.suites.length, 0)} suites, ~${Math.round(bins[index - 1].load)}s\n`);
}

// --list prints the selection and stops, so a shard split can be checked --
// that the shards cover every suite exactly once -- without running anything.
if (args.includes('--list')) { console.log(suites.join('\n')); process.exit(0); }

const server = spawn(process.execPath, [join(HERE, 'server.mjs')], { stdio: 'ignore' });
const stop = () => { try { server.kill(); } catch { /* already gone */ } };
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });

await new Promise((r) => setTimeout(r, 700));   // let the listener bind

let failedSuites = 0, totalPass = 0, totalFail = 0;
const seconds = {};
for (const suite of suites) {
  const started = Date.now();
  const out = await new Promise((resolve) => {
    let buf = '';
    const child = spawn(process.execPath, [join(HERE, suite)], { env: { ...process.env, PORT: String(PORT) } });
    child.stdout.on('data', (d) => { buf += d; });
    child.stderr.on('data', (d) => { buf += d; });
    child.on('close', (code) => resolve({ buf, code }));
  });
  seconds[suite] = +((Date.now() - started) / 1000).toFixed(1);
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
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${suite.replace('.mjs', '').padEnd(24)} ${line.padEnd(24)} ${seconds[suite]}s`);
}
stop();
console.log(`\n${suites.length - failedSuites}/${suites.length} suites passed` +
  (totalPass + totalFail ? `  (${totalPass} assertions passed, ${totalFail} failed)` : ''));
if (process.env.WRITE_TIMINGS) writeFileSync(process.env.WRITE_TIMINGS, JSON.stringify(seconds, null, 2) + '\n');
process.exit(failedSuites ? 1 : 0);
