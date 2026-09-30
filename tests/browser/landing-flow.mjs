// Can a first-time visitor get where they came for?
//
// The landing-page review found that the four proposal pages were reachable
// only from each other, that the header had no Contact link and the home page
// no phone number, that five buttons competed for the first click, that the
// blue top-right button looked like a sign-in, and that half the numbers on
// the home cards were unconfirmed placeholders shown as facts. These check the
// paths, not just that the pages exist.
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br = await chromium.launch({ executablePath: EXECUTABLE });
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
const facts = JSON.parse(readFileSync(new URL('../../content/facts.json', import.meta.url), 'utf8'));
const rates = JSON.parse(readFileSync(new URL('../../src/data/rates.json', import.meta.url), 'utf8'));
const MAIN_PHONE = facts.phones.find((p) => p.id === 'latvian-centre').number;

async function open(route = '/', viewport = { width: 1440, height: 900 }, mobile = false) {
  const ctx = await br.newContext({ viewport, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
  await blockFonts(ctx);
  const p = await ctx.newPage();
  await p.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1000);
  await p.locator('button', { hasText: 'Essential only' }).click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(200);
  return { ctx, p };
}
const path = (p) => new URL(p.url()).pathname;

// ---------- the pitch is reachable from the front page ----------
{
  const { ctx, p } = await open('/');
  await p.locator('[role="note"] button', { hasText: 'Read the proposal' }).click();
  await p.waitForTimeout(600);
  check(path(p) === '/proposal', 'the banner on the home page has a "Read the proposal" link that opens /proposal (1 click)');
  const steps = await p.locator('main ol li').count();
  check(steps === 5, `the proposal page lists five pages in order (${steps})`);
  const order = [['The business case', '/leadership'], ['Who underwrites what', '/underwriters'], ['The ask, in two phases', '/phased-ask'], ['The KESKUS launch', '/keskus'], ['Try it as a member', '/dashboard']];
  for (const [label, want] of order) {
    await p.goto(BASE + '/proposal', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(500);
    await p.locator('main li button', { hasText: label }).click(); await p.waitForTimeout(600);
    check(path(p) === want, `proposal step "${label}" opens ${want} (${path(p)})`);
  }
  for (const route of ['/underwriters', '/phased-ask', '/leadership']) {
    await p.goto(BASE + route, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(600);
    await p.locator('main button', { hasText: 'The proposal, in reading order' }).click(); await p.waitForTimeout(500);
    check(path(p) === '/proposal', `${route} links back to the proposal page`);
  }
  // the banner is on every page, so the path exists from anywhere
  await p.goto(BASE + '/rates', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(600);
  check(await p.locator('[role="note"] button', { hasText: 'Read the proposal' }).count() === 1, 'the banner link is on other pages too');
  await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(500);
  await p.locator('footer button', { hasText: 'The Proposal' }).click(); await p.waitForTimeout(500);
  check(path(p) === '/proposal', 'and in the footer');
  const robots = await p.evaluate(() => document.querySelector('meta[name="robots"]')?.content);
  check(/noindex/.test(robots || ''), `the proposal page is noindex (${robots})`);
  await ctx.close();
}

// ---------- contact is one click from anywhere, and on the front page ----------
{
  const { ctx, p } = await open('/');
  const homeText = await p.locator('main').innerText();
  check(homeText.includes(MAIN_PHONE), `the home page shows a phone number (${MAIN_PHONE}) without scrolling to the footer`);
  const heroPhone = await p.evaluate(() => { const a = document.querySelector('main section a[href^="tel:"]'); return a ? { href: a.getAttribute('href'), top: Math.round(a.getBoundingClientRect().top) } : null; });
  check(heroPhone && heroPhone.href === `tel:+1${MAIN_PHONE.replace(/\D/g, '')}`, `it is a real tel: link to the same number (${heroPhone?.href})`);
  await p.locator('nav button', { hasText: /^Contact$/ }).first().click(); await p.waitForTimeout(500);
  check(path(p) === '/contact', 'the header has Contact, and it opens /contact');
  await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(500);
  await p.locator('main section button', { hasText: 'find a branch' }).click(); await p.waitForTimeout(500);
  check(path(p) === '/contact', 'the hero "find a branch" link opens /contact');
  await ctx.close();
}
// the extra header item must not break the header at the widths people use
for (const [w, label] of [[1100, 'laptop 1100'], [1280, 'desktop 1280'], [1440, 'desktop 1440']]) {
  const { ctx, p } = await open('/', { width: w, height: 800 });
  const m = await p.evaluate(() => { const n = document.querySelector('nav'); const items = [...n.querySelectorAll('button')].filter((b) => b.getBoundingClientRect().width > 0); const right = Math.max(...items.map((b) => b.getBoundingClientRect().right)); const tops = new Set(items.filter((b) => /^(Insurance|Advice|Apply|Travel|Business|Digital|Tools|Rates|Community|Contact)$/.test(b.innerText.trim())).map((b) => Math.round(b.getBoundingClientRect().top))); return { right, vw: innerWidth, rows: tops.size, hscroll: document.documentElement.scrollWidth > innerWidth }; });
  check(m.right <= m.vw && m.rows === 1 && !m.hscroll, `${label}: the header fits on one row with nothing off-screen (right edge ${Math.round(m.right)} of ${m.vw}, rows ${m.rows})`);
  await ctx.close();
}

// ---------- the demo button says what it is ----------
{
  const { ctx, p } = await open('/');
  check(await p.locator('nav button', { hasText: /^Try the demo$/ }).count() >= 1 && await p.locator('nav button', { hasText: 'Access demo' }).count() === 0, 'the top-right button is "Try the demo", not something that reads like a sign-in');
  await p.locator('nav button', { hasText: /^Try the demo$/ }).first().click(); await p.waitForTimeout(400);
  check(/no sign-in on this demonstration/i.test(await p.locator('[role="dialog"]').innerText()), 'and it opens the notice that says there is no sign-in');
  await ctx.close();
}

// ---------- one main action in the hero ----------
{
  const { ctx, p } = await open('/');
  const hero = await p.evaluate(() => [...document.querySelector('main section').querySelectorAll('button')].filter((b) => /^(Compare Accounts|Explore Mortgages|Apply for a Credit Card|Ask about insurance)$/.test(b.innerText.trim())).map((b) => ({ label: b.innerText.trim(), filled: getComputedStyle(b).backgroundColor !== 'rgba(0, 0, 0, 0)' })));
  const filled = hero.filter((b) => b.filled);
  check(hero.length === 4 && filled.length === 1 && filled[0].label === 'Compare Accounts', `exactly one filled (primary) hero button, "Compare Accounts", the other three quiet (${filled.map((b) => b.label).join(', ')})`);
  await ctx.close();
}

// ---------- numbers that are not confirmed do not look confirmed ----------
{
  const { ctx, p } = await open('/');
  const cards = await p.evaluate(() => [...document.querySelectorAll('main h3')].filter((h) => ['Mortgages', 'Credit Cards', 'Chequing Accounts', 'Savings & GICs', 'Investments'].includes(h.innerText.trim())).map((h) => { const card = h.closest('button') || h.parentElement; return { name: h.innerText.trim(), tagged: /illustrative/.test(card.innerText) }; }));
  const byName = Object.fromEntries(cards.map((c) => [c.name, c.tagged]));
  const confirmed = new Set(Object.keys(rates.verified).filter((k) => !k.startsWith('_')));
  check(byName['Mortgages'] === !confirmed.has('m3'), `Mortgages (3-year closed, confirmed=${confirmed.has('m3')}) is ${byName['Mortgages'] ? '' : 'not '}tagged illustrative`);
  check(byName['Credit Cards'] && byName['Chequing Accounts'] && byName['Savings & GICs'], 'the credit card, chequing and GIC figures (unconfirmed) are tagged illustrative');
  check(/not been confirmed against Northern Birch's posted rates/.test(await p.locator('main').innerText()), 'and a note under the cards says what the tag means');
  await ctx.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
