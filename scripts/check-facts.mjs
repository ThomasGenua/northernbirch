// A wrong phone number is the worst thing this site can ship: a member calls it
// in a hurry and reaches someone else. So every number the site shows has to be
// in content/facts.json, and every tel: link has to dial the number it shows.
//
// Fails the build when:
//   - facts.json is malformed (missing fields, duplicate ids or numbers, a
//     branch pointing at a phone that does not exist),
//   - src/, netlify/ or index.html shows a phone number that is not in it,
//   - a tel: link dials a number that is not in it, or a different number
//     from the one written inside the link,
//   - a "since <year>" claim uses a year other than the recorded founding years.
// Warns (does not fail) for records nobody has checked against a source yet.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const facts = JSON.parse(readFileSync(join(ROOT, 'content/facts.json'), 'utf8'));
const errors = [], warnings = [];

// --- the file itself ---
const digits = (s) => s.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
const phones = new Map();
for (const p of facts.phones || []) {
  for (const k of ['id', 'number', 'label', 'owner']) if (!p[k]) errors.push(`facts.json: phone ${p.id || '?'} is missing ${k}`);
  if (!/^(1-)?\d{3}-\d{3}-\d{4}$/.test(p.number || '')) errors.push(`facts.json: phone ${p.id} "${p.number}" is not written as 416-555-0100 or 1-800-555-0100`);
  if ([...phones.values()].some((q) => q.id === p.id)) errors.push(`facts.json: duplicate phone id ${p.id}`);
  if (phones.has(digits(p.number))) errors.push(`facts.json: ${p.number} is listed twice`);
  phones.set(digits(p.number), p);
  if (!p.verified) warnings.push(`${p.label} (${p.number}) has not been checked against ${p.sourceUrl || 'a source'}`);
}
const phoneIds = new Set([...phones.values()].map((p) => p.id));
for (const b of facts.branches || []) {
  if (!b.name || !b.address || !b.hours) errors.push(`facts.json: branch ${b.id} needs name, address and hours`);
  if (b.phone && !phoneIds.has(b.phone)) errors.push(`facts.json: branch ${b.id} points at phone "${b.phone}", which is not listed`);
}
const L = facts.limits || {};
for (const k of ['taxYear', 'tfsaAnnual', 'tfsaCumulative', 'rrspMax'])
  if (!Number.isFinite(L[k])) errors.push(`facts.json: limits.${k} must be a number`);
if (L.taxYear && L.taxYear < new Date().getFullYear()) warnings.push(`limits are for ${L.taxYear}; this is ${new Date().getFullYear()} -- update them`);
if (!L.verified) warnings.push('registered-plan limits have not been checked against the CRA');
const foundingYears = new Set((facts.organisation || []).map((o) => o.value).filter((v) => /^\d{4}$/.test(v)));

// --- the site ---
const EXEMPT = [/\.test\.mjs$/];
function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(jsx?|mjs|html)$/.test(name)) yield p;
  }
}
const targets = [...files(join(ROOT, 'src')), ...files(join(ROOT, 'netlify')), join(ROOT, 'index.html')]
  .filter((p) => !EXEMPT.some((re) => re.test(p)));

let seen = 0, links = 0;
for (const path of targets) {
  const rel = relative(ROOT, path);
  const src = readFileSync(path, 'utf8');
  const line = (i) => src.slice(0, i).split('\n').length;
  for (const m of src.matchAll(/(?<![\d-])(?:1-)?\d{3}-\d{3}-\d{4}(?![\d-])/g)) {
    seen++;
    if (!phones.has(digits(m[0]))) errors.push(`${rel}:${line(m.index)} shows ${m[0]}, which is not in content/facts.json`);
  }
  // tel: links -- the number dialled must be known and must match the text shown
  for (const m of src.matchAll(/href=\{?["'`]tel:([+\d-]+)["'`]\}?[^>]*>([^<]*)</g)) {
    links++;
    const dialled = digits(m[1]);
    if (!phones.has(dialled)) errors.push(`${rel}:${line(m.index)} tel:${m[1]} dials a number that is not in content/facts.json`);
    const shown = m[2].match(/(?:1-)?\d{3}-\d{3}-\d{4}/);
    if (shown && digits(shown[0]) !== dialled) errors.push(`${rel}:${line(m.index)} shows ${shown[0]} but dials ${m[1]}`);
  }
  for (const m of src.matchAll(/\bsince (19\d{2})\b/gi))
    if (!foundingYears.has(m[1])) errors.push(`${rel}:${line(m.index)} says "since ${m[1]}"; the recorded founding years are ${[...foundingYears].join(' and ')}`);
}

for (const w of warnings) console.warn(`facts: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`facts: ${e}`);
  console.error(`\nfacts: ${errors.length} problem(s). A number the site shows must be in content/facts.json, with where it came from.`);
  process.exit(1);
}
console.log(`facts ok -- ${phones.size} phone numbers, ${seen} shown and ${links} tel: links checked across ${targets.length} files; ${warnings.length} records not yet checked against a source`);
