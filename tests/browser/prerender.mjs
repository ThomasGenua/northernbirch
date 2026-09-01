// The build renders every route to HTML. Two things have to hold: a client
// that never runs JavaScript can read the page, and a client that does run it
// adopts that markup instead of throwing it away.
import { chromium } from 'playwright-core';
import { BASE, ROUTES, EXECUTABLE, blockFonts } from './env.mjs';

const br = await chromium.launch({ executablePath: EXECUTABLE });
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

// ---- 1. readable with JavaScript switched off ----
{
  const ctx = await br.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 1000 } });
  await blockFonts(ctx);
  // Four routes open on a question or an empty form rather than prose. They
  // still have to render that first screen; they just cannot be measured in
  // paragraphs.
  const OPENS_ON_A_FORM = new Set(['/financial-health-check', '/calculators', '/policy-document-reader', '/estate']);
  const thin = [], placeholder = [], chrome = [];
  for (const r of ROUTES) {
    const p = await ctx.newPage();
    await p.goto(BASE + r, { waitUntil: 'domcontentloaded' });
    const text = (await p.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    const heads = await p.locator('main h1, main h2, main h3, main label, main legend').count();
    if (await p.locator('nav').count() === 0 || await p.locator('footer').count() === 0) chrome.push(r);
    if (/^Loading/.test(text) || text.length < 40 || heads === 0) placeholder.push(`${r} (${text.length} chars)`);
    if (!OPENS_ON_A_FORM.has(r) && text.length < 400) thin.push(`${r} (${text.length} chars)`);
    await p.close();
  }
  check(placeholder.length === 0, `no route serves a placeholder instead of a page${placeholder.length ? ': ' + JSON.stringify(placeholder.slice(0, 4)) : ''}`);
  check(chrome.length === 0, `every route has its nav and footer without JavaScript${chrome.length ? ': ' + JSON.stringify(chrome.slice(0, 4)) : ''}`);
  check(thin.length === 0, `and the ${ROUTES.length - OPENS_ON_A_FORM.size} content routes are readable${thin.length ? ': ' + JSON.stringify(thin.slice(0, 4)) : ''}`);
  await ctx.close();
}

// ---- 2. the markup is adopted, not replaced ----
// A hydration mismatch is a console error in dev and a minified React error in
// a production build; either way React throws the server HTML away and redraws,
// which is the whole benefit gone.
const hydrationErrors = async (route, width) => {
  const ctx = await br.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await blockFonts(ctx);
  const bad = [];
  const p = await ctx.newPage();
  p.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/hydrat|did not match|Minified React error #(418|421|422|423|425)/i.test(t)) bad.push(t.slice(0, 140));
  });
  p.on('pageerror', e => bad.push('pageerror: ' + String(e).slice(0, 140)));
  await p.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1800);
  await p.close(); await ctx.close();
  return bad;
};

// 1280 and 390 are not enough: the tablet band between them has its own
// breakpoint, and reading it during render is the same bug in a place the
// first version of this test could not see. 900 and 1024 sit either side of it.
for (const width of [1280, 1024, 900, 390]) {
  const failures = [];
  for (const r of ROUTES) {
    const bad = await hydrationErrors(r, width);
    if (bad.length) failures.push(`${r}: ${bad[0]}`);
  }
  check(failures.length === 0, `every route hydrates cleanly at ${width}px${failures.length ? ` (${failures.length} bad): ` + JSON.stringify(failures.slice(0, 2)) : ''}`);
}

// ---- 3. the page a member sees first is the real one ----
{
  const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 } });
  await blockFonts(ctx);
  const p = await ctx.newPage();
  // no JS at all: whatever is in the HTML is what they get
  const res = await p.goto(BASE + '/apply', { waitUntil: 'domcontentloaded' });
  const html = await res.text();
  check(/<div id="root"><[^>]/.test(html), 'the served HTML has markup inside #root');
  check(html.includes('Start your application'), 'and the page heading is in it');
  check(!html.includes('Cookie preferences'), 'the cookie banner is not baked into the prerendered HTML');
  await p.close(); await ctx.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
