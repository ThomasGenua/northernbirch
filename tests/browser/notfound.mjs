// The site had no 404. netlify.toml sent every unmatched path to index.html
// with status 200 and pageFromPath fell back to "home", so a mistyped or
// retired URL served the homepage at the wrong address: a soft 404 that search
// engines index as a duplicate of the front page, and that tells a member
// nothing about what went wrong.
//
// These check the whole seam -- status code, prerendered file, hydrated app,
// meta, and that real routes did not become collateral damage.
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE, DIST, EXECUTABLE, ROUTES, blockFonts } from './env.mjs';

const br = await chromium.launch({ executablePath: EXECUTABLE });
const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
ctx.setDefaultTimeout(8000);
await blockFonts(ctx);
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

const MISSES = ['/mortgagez', '/gics', '/old-page', '/personal/extra', '/%20', '/Mortgages'];

// --- the status code, which is the whole point ---
for (const path of MISSES) {
  const res = await ctx.request.get(BASE + path, { maxRedirects: 0 });
  check(res.status() === 404, `${path} answers 404, not 200 (got ${res.status()})`);
}

// --- and every real route still answers 200 ---
{
  const bad = [];
  for (const r of ROUTES) {
    const res = await ctx.request.get(BASE + r, { maxRedirects: 0 });
    if (res.status() !== 200) bad.push(`${r} -> ${res.status()}`);
  }
  check(bad.length === 0, `all ${ROUTES.length} real routes still answer 200${bad.length ? ': ' + JSON.stringify(bad.slice(0, 5)) : ''}`);
}

// --- the page a member actually sees ---
{
  const p = await ctx.newPage();
  const res = await p.goto(BASE + '/mortgagez', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  check(res.status() === 404, 'navigating to an unknown URL gets a 404 status');
  const txt = await p.locator('main, body').first().innerText();
  check(/couldn't find that page/i.test(txt), 'the page says the page could not be found');
  check(!/Banking that belongs to you/i.test(txt), 'it is not the homepage wearing a different URL');
  check(txt.includes('/mortgagez'), 'it names the address that was asked for');
  check(/416-465-4659/.test(txt), 'it offers a way to reach a human');
  check((await p.title()).startsWith('Page not found'), `the title says so, rather than the homepage's (${await p.title()})`);
  // The URL must not be rewritten: a member should be able to see, copy and
  // correct what they typed.
  check(new URL(p.url()).pathname === '/mortgagez', 'the address bar still shows what was asked for');
  await p.close();
}

// --- the links out of it work ---
{
  const p = await ctx.newPage();
  await p.goto(BASE + '/nowhere', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  await p.locator('button', { hasText: 'Essential only' }).click().catch(() => {});
  await p.getByRole('button', { name: /Back to the homepage/i }).click();
  await p.waitForTimeout(900);
  check(new URL(p.url()).pathname === '/', 'the homepage button navigates to /');
  const txt = await p.locator('main, body').first().innerText();
  check(!/couldn't find that page/i.test(txt), 'and the 404 content is gone once it does');
  await p.close();
}

// --- no JavaScript: the prerendered file has to carry it ---
{
  const noJs = await br.newContext({ viewport: { width: 1280, height: 1000 }, javaScriptEnabled: false });
  await blockFonts(noJs);
  const p = await noJs.newPage();
  await p.goto(BASE + '/missing-page', { waitUntil: 'domcontentloaded' });
  const txt = await p.locator('body').innerText();
  check(/couldn't find that page/i.test(txt), 'the 404 reads correctly with JavaScript disabled');
  check(/Where you might have been going/i.test(txt), 'including the suggested destinations');
  await noJs.close();
}

// --- what it tells a crawler ---
{
  const html = readFileSync(join(DIST, '404.html'), 'utf8');
  check(/<meta name="robots" content="noindex, follow"/.test(html), '404.html is noindex');
  // One file answers every unmatched URL, so any canonical it named would
  // point a crawler at a page the visitor did not ask for.
  check(!/rel="canonical"/.test(html), '404.html declares no canonical');
  check(!/og:url/.test(html), '404.html declares no og:url');
  check(/<title>Page not found/.test(html), '404.html has its own title');

  const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  check(!/404/.test(sitemap), 'the 404 is not in the sitemap');

  // The pages the build marks noindex must stay that way once the app runs:
  // a crawler that executes JavaScript reads what applyMeta wrote over it.
  const p = await ctx.newPage();
  await p.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  const robots = await p.locator('meta[name="robots"]').getAttribute('content');
  check(robots === 'noindex, nofollow', `/dashboard is still noindex after hydration (got ${JSON.stringify(robots)})`);
  await p.goto(BASE + '/accounts', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1200);
  const ok = await p.locator('meta[name="robots"]').getAttribute('content');
  check(ok === 'index, follow', `/accounts is indexable (got ${JSON.stringify(ok)})`);
  await p.close();
}

// --- accessibility ---
// accessibility-wcag.mjs walks env.mjs ROUTES, and this page deliberately has
// no route, so it would never be covered there.
{
  const p = await ctx.newPage();
  await p.goto(BASE + '/not-a-page', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2000);                     // let the 0.8s Fade transitions settle
  await p.addScriptTag({ url: '/axe.min.js' });
  const res = await p.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } }));
  const v = res.violations;
  const n = v.reduce((acc, x) => acc + x.nodes.length, 0);
  check(n === 0, `no WCAG 2 A/AA violations${n ? ': ' + v.map((x) => `${x.id}(${x.nodes.length})`).join(', ') : ''}`);
  await p.close();
}

// --- the catch-all is gone from the config, not just from the output ---
{
  const toml = readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8');
  check(!/from\s*=\s*"\/\*"[\s\S]{0,80}?to\s*=\s*"\/index\.html"/.test(toml),
    'netlify.toml no longer redirects every unmatched path to the homepage');
}

console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
process.exit(fail ? 1 : 0);
