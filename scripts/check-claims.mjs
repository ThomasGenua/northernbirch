// Refuses to build if the site asserts something that is not true.
//
// Every claim below was corrected once after a content review. Correcting
// strings by hand does not keep them corrected: the same wrong rate, the same
// invented coverage limit and the same non-partner's claims line had each been
// copied into several files, and nothing would have noticed them coming back.
// This runs before the build, the way check-rates and check-routes do.
//
// Rules are deliberately narrow. "Co-op" is not banned -- co-op and
// co-ownership MORTGAGE lending is real and is the best differentiator this
// credit union has; only co-op *insurance* is invented. Precision matters more
// than coverage here: a rule that cries wolf gets deleted.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { RULES } from './claims-rules.mjs';

const ROOT = process.cwd();

// Files whose whole job is to catch these strings, or to explain them.
const EXEMPT = [
  'scripts/check-claims.mjs',
  'scripts/claims-rules.mjs',
  'netlify/functions/prompts.test.mjs',
  'netlify/edge-functions/password-gate.test.mjs',
  'docs/',
];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'dist-ssr' || name === '.git') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx?|mjs)$/.test(name)) files.push(p);
  }
};
for (const dir of ['src', 'netlify', 'scripts']) walk(join(ROOT, dir));

const hits = [];
for (const file of files) {
  const rel = relative(ROOT, file);
  if (EXEMPT.some((e) => rel.startsWith(e))) continue;
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const { re, why } of RULES) {
    for (const m of text.matchAll(re)) {
      const line = text.slice(0, m.index).split('\n').length;
      hits.push({ rel, line, found: m[0].trim(), why, context: (lines[line - 1] || '').trim().slice(0, 90) });
    }
  }
}

// A ratchet, not a gate. 83 of these were found the first time this ran, and
// most are structural rather than a wrong word: the quote engine is a whole
// page, so is estate planning, and co-op insurance is woven through the
// insurance copy. Fixing them all at once would be a rewrite. So the known set
// is frozen in claims-baseline.json and the build fails only on something NEW
// -- the backlog stays visible on every build and can only shrink.
//
// To burn one down: fix the copy, then regenerate with
//   UPDATE_CLAIMS_BASELINE=1 node scripts/check-claims.mjs
const BASELINE = join(ROOT, 'scripts', 'claims-baseline.json');
const key = (h) => `${h.rel} :: ${h.why}`;
const tally = (list) => list.reduce((acc, h) => (acc[key(h)] = (acc[key(h)] || 0) + 1, acc), {});

const now = tally(hits);
if (process.env.UPDATE_CLAIMS_BASELINE) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + '\n');
  console.log(`baseline updated -- ${hits.length} known claims across ${Object.keys(now).length} file/rule pairs`);
  process.exit(0);
}
let known = {};
try { known = JSON.parse(readFileSync(BASELINE, 'utf8')); } catch { /* no baseline yet: everything is new */ }

const regressions = [];
for (const h of hits) if ((now[key(h)] || 0) > (known[key(h)] || 0)) regressions.push(h);
const fixedPairs = Object.keys(known).filter((k) => !(k in now));

if (regressions.length) {
  console.error(`\nThe site asserts ${regressions.length} NEW thing${regressions.length > 1 ? 's' : ''} that is not true:\n`);
  for (const h of regressions) {
    console.error(`  ${h.rel}:${h.line}  "${h.found}"`);
    console.error(`      ${h.why}`);
    console.error(`      ${h.context}\n`);
  }
  console.error('Nothing was built. Fix the copy, or narrow the rule in scripts/check-claims.mjs\n');
  process.exit(1);
}
if (fixedPairs.length) {
  console.log(`claims: ${fixedPairs.length} baseline entr${fixedPairs.length > 1 ? 'ies are' : 'y is'} now clean -- regenerate with UPDATE_CLAIMS_BASELINE=1`);
}
console.log(`claims ok -- ${files.length} files, ${RULES.length} rules, ${hits.length} known claims still to correct (see scripts/claims-baseline.json)`);
process.exit(0);
