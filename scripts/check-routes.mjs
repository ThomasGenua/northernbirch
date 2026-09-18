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
// Pages that deliberately have no URL. "notfound" is reachable only by asking
// for a path that is not in ROUTES, so requiring a route for it would be
// wrong -- but it still has to be in the pages map, or an unknown URL would
// render nothing at all.
const nonRoutePages = [...between(ui, 'export const NON_ROUTE_PAGES=[', '];', 'NON_ROUTE_PAGES')
  .matchAll(/"(\w+)"/g)].map((m) => m[1]);
for (const key of nonRoutePages) {
  if (!pageKeys.has(key)) errors.push(`"${key}" is listed in NON_ROUTE_PAGES but is not in the pages map -- nothing would render it`);
  if (routes.some((r) => r.key === key)) errors.push(`"${key}" is in NON_ROUTE_PAGES and also in ROUTES -- it cannot be both`);
}

for (const key of metaKeys) {
  if (!routes.some((r) => r.key === key)) errors.push(`META has "${key}", which is not a route`);
}
for (const key of pageKeys) {
  if (!routes.some((r) => r.key === key) && !nonRoutePages.includes(key)) errors.push(`the pages map has "${key}", which is not a route`);
}

// The prerendered HTML and the running app each decide what to put in the
// robots meta, and a crawler that runs JavaScript sees the app's answer write
// over the file's. If these two lists drift, a page marked noindex at build
// time quietly becomes indexable again.
const excluded = new Set([...between(read('scripts/generate-seo-files.mjs'), 'const EXCLUDE = new Set([', ']);', 'the EXCLUDE list')
  .matchAll(/'([^']+)'/g)].map((m) => m[1]));
const noindexPages = new Set([...between(ui, 'export const NOINDEX_PAGES=new Set([', ']);', 'NOINDEX_PAGES')
  .matchAll(/"(\w+)"/g)].map((m) => m[1]));
const noindexPaths = new Set([...noindexPages].map((k) => (routes.find((r) => r.key === k) || {}).path || k));
for (const p of excluded) {
  if (!noindexPaths.has(p)) errors.push(`generate-seo-files.mjs marks ${p} noindex, but NOINDEX_PAGES in src/ui.jsx does not -- the app would set it back to index`);
}
for (const p of noindexPaths) {
  if (!excluded.has(p)) errors.push(`NOINDEX_PAGES in src/ui.jsx marks ${p} noindex, but generate-seo-files.mjs does not -- the prerendered file would say index`);
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

// --- forms must not collect, and must not store ---
// These used to be Netlify Forms: index.html carried a hidden declaration of
// each, and Netlify stored every submission. On a demonstration wearing a real
// credit union's branding that meant visitors' names, phone numbers and free
// text were being kept by a site that is not a bank. They post to
// /api/demo-intake now, which validates the shape and discards the body.
//
// So this checks the opposite of what it used to: that no Netlify form is
// declared anywhere (a declaration is what creates a store), that every form
// the app submits is one the intake accepts, and that none of them has started
// asking for something that must never be collected.
const intake = read('netlify/functions/demo-intake.mjs');
const accepted = new Set([...between(intake, 'const FORMS = new Set([', ']);', "demo-intake's form list")
  .matchAll(/"(\w+)"/g)].map((m) => m[1]));

if (/<form[^>]+data-netlify|netlify-honeypot/.test(html))
  errors.push('index.html declares a Netlify form -- that creates a submission store, and this demo must not keep anything');

const src = ['src/App.jsx', 'src/ui.jsx', ...readdirSync(join(process.cwd(), 'src/pages')).filter((f) => f.endsWith('.jsx')).map((f) => `src/pages/${f}`)];
for (const f of src) {
  let text; try { text = read(f); } catch { continue; }
  for (const call of text.matchAll(/submitForm\("([^"]+)"/g)) {
    if (!accepted.has(call[1]))
      errors.push(`${f} submits the form "${call[1]}", which netlify/functions/demo-intake.mjs does not accept`);
  }
  // Belt and braces with the same list inside demo-intake: this stops us
  // writing the field, that stops a hand-crafted POST carrying it.
  for (const n of ['sin', 'socialInsurance', 'dateOfBirth', 'password', 'accountNumber']) {
    if (new RegExp(`submitForm\\([^)]*\\b${n}\\b`).test(text))
      errors.push(`${f} submits "${n}" -- that must never leave the browser`);
  }
}

if (errors.length) {
  console.error(`\nThe site's routes and forms are inconsistent (${errors.length} problem${errors.length > 1 ? 's' : ''}):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nNothing was built.\n');
  process.exit(1);
}
console.log(`routes ok -- ${routes.length} routes wired through META, the page map, search and the suites; ${accepted.size} forms, none stored`);
