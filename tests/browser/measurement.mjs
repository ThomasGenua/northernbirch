// Measurement is consent-gated and off unless a domain is configured. Both
// halves matter: the shipped build must be silent, and the configured build
// must actually work -- a tracker blocked by our own CSP would fail quietly.
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync } from 'node:fs';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

// This suite rebuilds dist twice, and vite empties the directory each time --
// taking axe.min.js, which run.mjs stages there for the accessibility suites
// that run after this one. Put it back, or they fail for no reason of theirs.
const AXE_SRC = new URL('../../node_modules/axe-core/axe.min.js', import.meta.url);
const AXE_DST = new URL('../../dist/axe.min.js', import.meta.url);
const restageAxe = () => { try { if (existsSync(AXE_SRC)) copyFileSync(AXE_SRC, AXE_DST); } catch { /* the axe suites will say so */ } };

const br = await chromium.launch({ executablePath: EXECUTABLE });
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

// Records every request the page tries to make to the tracker, whether or not
// it succeeds -- a blocked request still proves intent.
const visit = async (consent) => {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
  await blockFonts(ctx);
  const hits = [];
  ctx.on('request', r => { if (r.url().includes('plausible.io')) hits.push(r.url()); });
  const p = await ctx.newPage();
  const blocked = [];
  p.on('console', m => { if (/Content Security Policy/i.test(m.text())) blocked.push(m.text()); });
  await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(900);
  await p.locator('button', { hasText: consent }).click().catch(() => {});
  await p.waitForTimeout(600);
  // a route change, which is what fires a pageview in a single-page app
  await p.locator('nav button:visible', { hasText: /^Advice$/ }).first().click().catch(() => {});
  await p.waitForTimeout(900);
  const tags = await p.locator('script[src*="plausible"]').count();
  const banner = await p.evaluate(() => document.body.innerText.slice(0, 0) || '');
  await p.close(); await ctx.close();
  return { hits, tags, blocked, banner };
};

// ---- as shipped: no domain configured, nothing is measured either way ----
{
  for (const consent of ['Allow measurement', 'Essential only']) {
    const { hits, tags } = await visit(consent);
    check(hits.length === 0 && tags === 0, `unconfigured build requests nothing after "${consent}" (${hits.length} requests, ${tags} tags)`);
  }
  const ctx = await br.newContext(); const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(800);
  const txt = await p.locator('[aria-label="Cookie preferences"]').innerText().catch(() => '');
  check(/does not measure your visit today/.test(txt), 'and the banner tells the truth about it');
  await p.close(); await ctx.close();
}

// ---- with a domain configured: consent decides, and our own CSP allows it ----
{
  const DOMAIN = 'measure.test';
  console.log('   rebuilding with VITE_PLAUSIBLE_DOMAIN set...');
  execFileSync('npm', ['run', 'build'], { env: { ...process.env, VITE_PLAUSIBLE_DOMAIN: DOMAIN }, stdio: 'pipe' });
  restageAxe();
  try {
    const off = await visit('Essential only');
    check(off.hits.length === 0 && off.tags === 0, `"Essential only" loads no tracker even when configured (${off.hits.length} requests)`);

    const on = await visit('Allow measurement');
    check(on.tags === 1, `"Allow measurement" injects the tracker once (${on.tags} tags)`);
    check(on.hits.some(u => u.includes('/js/script.js')), `and requests it (${JSON.stringify(on.hits.slice(0, 1))})`);
    check(on.blocked.length === 0, `the site's own CSP does not block it${on.blocked.length ? ': ' + on.blocked[0].slice(0, 90) : ''}`);

    // what the events actually carry -- stub the tracker and read the calls
    {
      const c = await br.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
      await blockFonts(c);
      await c.addInitScript(() => { window.__ev = []; window.plausible = (e, o) => window.__ev.push([e, o]); });
      // The real plausible.io script -- reachable from a hosted CI runner, blocked
      // by this sandbox's own network policy locally -- overwrites window.plausible
      // with its own implementation once it loads, same as it would in production.
      // That's exactly what the earlier assertions in this block want to see; this
      // one wants to inspect what gets passed to it, so the fetch is aborted here
      // only, keeping the stub in place regardless of which environment runs it.
      await c.route('https://plausible.io/**', (route) => route.abort());
      const p = await c.newPage();
      await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(900);
      await p.locator('button', { hasText: 'Allow measurement' }).click(); await p.waitForTimeout(400);
      await p.locator('main button', { hasText: 'Explore Mortgages' }).first().click(); await p.waitForTimeout(700);
      await p.goBack(); await p.waitForTimeout(700);
      // a query that matches, to prove the event fires
      await p.keyboard.press('Control+k'); await p.waitForTimeout(350);
      await p.locator('[role="dialog"] input').fill('mortgage'); await p.waitForTimeout(400);
      await p.keyboard.press('Enter'); await p.waitForTimeout(700);
      // and one nobody should ever see, to prove the text does not travel
      const SECRET = 'am i underinsured';
      await p.keyboard.press('Control+k'); await p.waitForTimeout(350);
      await p.locator('[role="dialog"] input').fill(SECRET); await p.waitForTimeout(400);
      await p.keyboard.press('Enter'); await p.waitForTimeout(400);
      await p.keyboard.press('Escape'); await p.waitForTimeout(400);
      const ev = await p.evaluate(() => window.__ev);
      const names = ev.map(e => e[0]);
      check(names.includes('pageview'), `route changes report a pageview (${JSON.stringify(names)})`);
      check(names.includes('hero_cta'), 'a hero CTA reports which product it opened');
      check(names.includes('search_result'), 'opening a search result is counted');
      const dump = JSON.stringify(ev).toLowerCase();
      check(!dump.includes('underinsured'), 'and the search query itself never leaves the browser');
      check(!/\b(name|email|phone|amount)\b/.test(dump), 'no event carries a field a member typed');
      await p.close(); await c.close();
    }

    const ctx = await br.newContext(); const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(800);
    const txt = await p.locator('[aria-label="Cookie preferences"]').innerText().catch(() => '');
    check(/sets no cookies/.test(txt), 'the banner explains the measurement rather than denying it');
    check(!/does not measure your visit today/.test(txt), 'and no longer claims the site measures nothing');
    await p.close(); await ctx.close();
  } finally {
    console.log('   rebuilding without it...');
    execFileSync('npm', ['run', 'build'], { stdio: 'pipe' });
    restageAxe();
  }
  const { hits } = await visit('Allow measurement');
  check(hits.length === 0, 'the restored build is silent again');
}

console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
