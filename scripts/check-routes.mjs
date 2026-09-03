// Adding a page to this site means touching seven places: the page file, its
// lazy import, ROUTES, META, the search index, the browser suites' route list,
// and -- if it submits anything -- a hidden form in index.html for Netlify to
// find at deploy time. Miss one and the failure is quiet: a route with the
// homepage's title, a page that renders nothing, a form that 404s on submit.
//
// That is what shipped 20 duplicate titles before #16. This runs before the
// build and refuses to let any of it through again.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (f) => readFileSync(join(process.cwd(), f), 'utf8');
const ui = read('src/ui.jsx');
const app = read('src/App.jsx');
const html = read('index.html');
const env = read('tests/browser/env.mjs');

const errors = [];
const between = (s, start, end, what) => {
  const i = s.indexOf(start);
  if (i < 0) throw new Error(`${what} not found -- did it move or get renamed?`);
  const j = s.indexOf(end, i);
  return s.slice(i, j < 0 ? undefined : j);
};

// --- the tables ---
const routes = [...between(ui, 'export const ROUTES={', '\n};', 'ROUTES')
  .matchAll(/(\w+):"(\/[^"]*)"/g)].map((m) => ({ key: m[1], path: m[2] }));
if (routes.length < 20) errors.push(`only ${routes.length} routes parsed -- ROUTES may have changed shape`);

const metaKeys = new Set([...between(ui, 'export const META={', '\nexport const META_DEFAULT', 'META')
  .matchAll(/^\s{2}(\w+):\[/gm)].map((m) => m[1]));

const pageKeys = new Set([...between(app, 'const pages={', '\n  };', 'the pages map')
  .matchAll(/(\w+):</g)].map((m) => m[1]));

const searchPages = new Set([...app.matchAll(/\{title:"[^"]*",page:"(\w+)"/g)].map((m) => m[1]));
const testRoutes = new Set([...between(env, 'export const ROUTES = [', '];', "the suites' route list")
  .matchAll(/'([^']+)'/g)].map((m) => m[1]));

// --- every route is wired end to end ---
for (const { key, path } of routes) {
  if (!metaKeys.has(key)) errors.push(`${path} (${key}) has no META entry -- it would ship the default title and description`);
  if (!pageKeys.has(key)) errors.push(`${path} (${key}) is in ROUTES but not in the pages map -- it would render the homepage`);
  if (!testRoutes.has(path)) errors.push(`${path} is not in tests/browser/env.mjs ROUTES -- no suite would ever visit it`);
}
for (const key of metaKeys) {
  if (!routes.some((r) => r.key === key)) errors.push(`META has "${key}", which is not a route`);
}
for (const key of pageKeys) {
  if (!routes.some((r) => r.key === key)) errors.push(`the pages map has "${key}", which is not a route`);
}
for (const key of searchPages) {
  if (!routes.some((r) => r.key === key)) errors.push(`a search result points at "${key}", which is not a route`);
}
for (const p of testRoutes) {
  if (!routes.some((r) => r.path === p)) errors.push(`tests/browser/env.mjs lists ${p}, which is not a route`);
}
const seen = new Map();
for (const { key, path } of routes) {
  if (seen.has(path)) errors.push(`${path} is claimed by both "${seen.get(path)}" and "${key}"`);
  seen.set(path, key);
}

// --- meta that search engines will accept ---
for (const [key, entry] of [...between(ui, 'export const META={', '\nexport const META_DEFAULT', 'META')
  .matchAll(/^\s{2}(\w+):\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"\]/gm)].map((m) => [m[1], [m[2], m[3]]])) {
  const [title, desc] = entry;
  if (title.length > 70) errors.push(`META.${key} title is ${title.length} chars (max 70): ${JSON.stringify(title)}`);
  if (desc.length < 70 || desc.length > 200) errors.push(`META.${key} description is ${desc.length} chars (want 70-200)`);
}
const titles = new Map(), descs = new Map();
for (const m of between(ui, 'export const META={', '\nexport const META_DEFAULT', 'META')
  .matchAll(/^\s{2}(\w+):\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"\]/gm)) {
  if (titles.has(m[2])) errors.push(`META.${m[1]} repeats the title of META.${titles.get(m[2])}`);
  if (descs.has(m[3])) errors.push(`META.${m[1]} repeats the description of META.${descs.get(m[3])}`);
  titles.set(m[2], m[1]); descs.set(m[3], m[1]);
}

// --- forms Netlify can actually receive ---
// Netlify registers a form by parsing the deployed HTML at build time. A React
// form is invisible to that parser, so index.html carries a hidden copy. If the
// names drift apart the submission 404s and the member sees a failure they can
// do nothing about.
const declared = new Map();
for (const m of html.matchAll(/<form name="([^"]+)"[^>]*>([\s\S]*?)<\/form>/g))
  declared.set(m[1], new Set([...m[2].matchAll(/name="([^"]+)"/g)].map((x) => x[1])));

// Read the directory rather than the import list: 21 of the pages are pulled
// in with lazy(() => import(...)), which no "import X from" pattern matches --
// scanning imports quietly skipped every one of them, this check included.
const src = ['src/App.jsx', ...readdirSync(join(process.cwd(), 'src/pages')).filter((f) => f.endsWith('.jsx')).map((f) => `src/pages/${f}`)];
for (const f of src) {
  let text; try { text = read(f); } catch { continue; }
  for (const call of text.matchAll(/submitForm\("([^"]+)",\s*\{([^}]*)\}/g)) {
    const [, name, body] = call;
    if (!declared.has(name)) {
      errors.push(`${f} submits the form "${name}", which index.html does not declare -- Netlify would reject it`);
      continue;
    }
    const sent = [...body.matchAll(/(?:^|,)\s*(\w+)/g)].map((m) => m[1]).filter((n) => n !== 'CONSENT_VERSION');
    const missing = sent.filter((n) => !declared.get(name).has(n));
    if (missing.length) errors.push(`form "${name}" sends ${missing.join(', ')} -- not declared in index.html`);
  }
  for (const n of ['sin', 'socialInsurance', 'dateOfBirth', 'password', 'accountNumber']) {
    if (new RegExp(`submitForm\\([^)]*\\b${n}\\b`).test(text)) errors.push(`${f} submits "${n}" through a Netlify form -- that must never leave the browser this way`);
  }
}

if (errors.length) {
  console.error(`\nThe site's routes and forms are inconsistent (${errors.length} problem${errors.length > 1 ? 's' : ''}):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nNothing was built.\n');
  process.exit(1);
}
console.log(`routes ok -- ${routes.length} routes wired through META, the page map, search and the suites; ${declared.size} forms declared`);
