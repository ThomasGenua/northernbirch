// Every insurer this site names has to be one Northern Birch actually works
// with -- or be named somewhere whose whole purpose is saying it is proposed.
//
// This site named CUMIS, The Personal, Manulife and Co-operators on 45 lines as
// though they were current partners: policies in a member's dashboard, product
// cards "via CUMIS", a Terms page saying insurance was distributed on their
// behalf, and a Privacy page telling people their information was shared with
// them. None is a current partner. The Privacy statement was a false
// data-sharing disclosure.
//
// content/partners.json is now the single source: each carrier is 'live' or
// 'proposed'. This check refuses to build if:
//   - partners.json is malformed, or a record is missing a field
//   - a 'proposed' carrier, or a carrier not in the file at all, is named on
//     any page other than the ones listed in PROPOSAL_PAGES
//
// It warns, without failing, for live records with no source URL: the content
// review confirmed them, but a compliance officer will want a link, and
// inventing one would be worse than admitting there isn't one yet.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];

let data;
try { data = JSON.parse(readFileSync(join(ROOT, 'content/partners.json'), 'utf8')); }
catch (e) { console.error(`content/partners.json is not valid JSON: ${e.message}`); process.exit(1); }

// --- the file itself ---------------------------------------------------------
const FIELDS = ['id', 'line', 'carrier', 'status', 'licence', 'bearsCost', 'nbCost', 'revenue', 'notes'];
const ids = new Set();
for (const [i, p] of (data.partners || []).entries()) {
  const where = `partners[${i}]${p.id ? ` (${p.id})` : ''}`;
  for (const f of FIELDS) if (typeof p[f] !== 'string' || !p[f].trim()) errors.push(`${where} is missing "${f}"`);
  if (!['live', 'proposed'].includes(p.status)) errors.push(`${where} has status "${p.status}" -- must be live or proposed`);
  if (ids.has(p.id)) errors.push(`${where} repeats id "${p.id}"`);
  ids.add(p.id);
  if (p.status === 'live') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.verified || '')) errors.push(`${where} is live but has no verified date`);
    if (!p.sourceUrl) warnings.push(`${p.id}: live, but no source URL yet`);
  }
}
if (!(data.partners || []).length) errors.push('content/partners.json lists no partners');

// --- which names may appear where -------------------------------------------
// A carrier string like "CUMIS or The Personal" names two carriers.
const namesOf = (p) => p.carrier.split(/\s+or\s+|,\s*/).map((s) => s.trim()).filter((s) => s && !/^TO /.test(s));
const live = new Set((data.partners || []).filter((p) => p.status === 'live').flatMap(namesOf));

// Carriers this site used to name that are not in partners.json at all. They
// are neither live nor proposed, so they are refused everywhere a proposed one
// is -- and they stay listed here so the check keeps catching them.
const RETIRED = ['Manulife', 'Co-operators'];

const restricted = [...new Set([
  ...(data.partners || []).filter((p) => p.status === 'proposed').flatMap(namesOf),
  ...RETIRED,
])]
  // A proposed LINE with an existing carrier is not a proposed carrier: Aviso
  // Wealth is live for investments, so "Aviso" is not restricted just because
  // Aviso life insurance is proposed. The limit of a name check is that it
  // cannot tell which line a sentence is about -- that one needs a reader.
  .filter((n) => ![...live].some((l) => l.includes(n) || n.includes(l)));

// The pages whose purpose is discussing a proposal. Naming a proposed carrier
// there is the point; naming one anywhere a member would read it as a product
// is not.
const PROPOSAL_PAGES = [
  'src/pages/UnderwritersPage.jsx',   // the underwriter matrix: renders partners.json
  'src/pages/LeadershipPage.jsx',     // the business case addressed to the board
];
// Files whose job is to catch these names or explain them.
const EXEMPT = ['scripts/', 'docs/', 'content/', 'netlify/functions/prompts.test.mjs', 'tests/'];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (['node_modules', 'dist', 'dist-ssr', '.git'].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx?|mjs|html)$/.test(name)) files.push(p);
  }
};
for (const dir of ['src', 'netlify']) walk(join(ROOT, dir));
files.push(join(ROOT, 'index.html'));

for (const file of files) {
  const rel = relative(ROOT, file);
  if (PROPOSAL_PAGES.includes(rel) || EXEMPT.some((e) => rel.startsWith(e))) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((text, i) => {
    for (const name of restricted) {
      if (text.includes(name)) {
        errors.push(`${rel}:${i + 1} names "${name}", which is not a current Northern Birch partner -- ` +
          `name it only on the underwriter matrix, or mark it live in content/partners.json once it is`);
      }
    }
  });
}

for (const w of warnings) console.warn(`partners: ${w}`);
if (errors.length) {
  console.error(`\nThe site names insurers it does not work with (${errors.length} problem${errors.length > 1 ? 's' : ''}):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nNothing was built.\n');
  process.exit(1);
}
console.log(`partners ok -- ${live.size} live carriers, ${restricted.length} restricted to proposal pages${warnings.length ? `, ${warnings.length} live record${warnings.length > 1 ? 's' : ''} still need a source URL` : ''}`);
