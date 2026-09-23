// Keeps the Estonian and Latvian string files honest.
//
//   node scripts/check-i18n.mjs                     check
//   node scripts/check-i18n.mjs --update-baseline   accept today's gaps
//
// Fails the build when:
//   - content/i18n/et.json and lv.json do not have the same keys (one language
//     would silently fall back to English where the other does not),
//   - a value is empty,
//   - an English string newly added to a translated page has no entry. Gaps that
//     already exist are listed in scripts/i18n-baseline.json and may only shrink.
//
// "Translated pages" are TRANSLATED_PAGES in src/ui.jsx plus the site chrome in
// src/App.jsx. Only string literals -- T("...") and t("...", lang) -- are seen;
// a key passed in a variable is invisible here, and the report says how many.
//
// Nothing in the files is reviewed by a native speaker yet. This check proves
// the plumbing is complete, not that the Estonian or Latvian is right.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const BASELINE = 'scripts/i18n-baseline.json';

const langs = { et: JSON.parse(read('content/i18n/et.json')), lv: JSON.parse(read('content/i18n/lv.json')) };
const errors = [];

// --- the two files agree ---
const keys = Object.fromEntries(Object.entries(langs).map(([c, f]) => [c, new Set(Object.keys(f.strings))]));
for (const [a, b] of [['et', 'lv'], ['lv', 'et']])
  for (const k of keys[a]) if (!keys[b].has(k)) errors.push(`"${k}" is in ${a}.json but not ${b}.json`);
for (const [c, f] of Object.entries(langs))
  for (const [k, v] of Object.entries(f.strings)) if (typeof v !== 'string' || !v.trim()) errors.push(`${c}.json: "${k}" has an empty value`);

// --- which files are translated ---
const ui = read('src/ui.jsx');
const m = ui.match(/export const TRANSLATED_PAGES=new Set\(\[([^\]]*)\]\)/);
if (!m) { console.error('i18n: TRANSLATED_PAGES not found in src/ui.jsx'); process.exit(1); }
const pages = [...m[1].matchAll(/"(\w+)"/g)].map((x) => x[1]);
const app = read('src/App.jsx');
const files = { 'src/App.jsx': app };
for (const page of pages) {
  const comp = app.match(new RegExp(`\\b${page}:<(\\w+)`))?.[1];
  const imp = comp && app.match(new RegExp(`const ${comp}\\s*=\\s*lazy\\(\\(\\)\\s*=>\\s*import\\('\\./(pages/\\w+\\.jsx)'\\)\\)`))?.[1];
  const path = imp ? `src/${imp}` : `src/pages/${comp}.jsx`;
  if (!comp || !existsSync(join(ROOT, path))) { errors.push(`TRANSLATED_PAGES has "${page}", but its page file could not be found`); continue; }
  files[path] = read(path);
}

// --- English on translated pages with no entry ---
const unescape = (s) => s.replace(/\\(["'\\])/g, '$1');
const missing = {};
let dynamic = 0, seen = 0;
for (const [path, src] of Object.entries(files)) {
  const used = new Set();
  for (const x of src.matchAll(/\bT\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g)) used.add(unescape(x[1]));
  for (const x of src.matchAll(/\bt\(\s*"((?:[^"\\]|\\.)*)"\s*,/g)) used.add(unescape(x[1]));
  dynamic += [...src.matchAll(/\b[Tt]\(\s*[A-Za-z_$][\w.$[\]]*\s*[,)]/g)].length;
  seen += used.size;
  const gaps = [...used].filter((k) => !keys.et.has(k) || !keys.lv.has(k)).sort();
  if (gaps.length) missing[path] = gaps;
}

if (process.argv.includes('--update-baseline')) {
  writeFileSync(join(ROOT, BASELINE), JSON.stringify(missing, null, 2) + '\n');
  const n = Object.values(missing).flat().length;
  console.log(`i18n baseline updated -- ${n} strings on translated pages still need Estonian and Latvian`);
  process.exit(errors.length ? 1 : 0);
}

const baseline = existsSync(join(ROOT, BASELINE)) ? JSON.parse(read(BASELINE)) : {};
let known = 0;
for (const [path, gaps] of Object.entries(missing)) {
  const ok = new Set(baseline[path] || []);
  for (const k of gaps) {
    if (ok.has(k)) known++;
    else errors.push(`${path}: "${k}" is shown on a translated page but has no entry in content/i18n/et.json and lv.json`);
  }
}
// Gaps that were closed must come off the list, so it can only shrink.
for (const [path, gaps] of Object.entries(baseline))
  for (const k of gaps) if (!(missing[path] || []).includes(k)) errors.push(`${BASELINE}: "${k}" in ${path} is translated or gone now -- remove it (or run with --update-baseline)`);

if (errors.length) {
  for (const e of errors) console.error(`i18n: ${e}`);
  console.error(`\ni18n: ${errors.length} problem(s). Add the string to both files, or -- for a gap you accept for now -- run node scripts/check-i18n.mjs --update-baseline`);
  process.exit(1);
}
console.log(`i18n ok -- ${keys.et.size} strings in et and lv (${langs.et.reviewed ? 'reviewed' : 'NOT reviewed by a native speaker'}); ${seen} literal keys on ${Object.keys(files).length} translated files, ${known} known gaps, ${dynamic} keys passed as variables not checked`);
