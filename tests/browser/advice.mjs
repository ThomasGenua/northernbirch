import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br = await chromium.launch({ executablePath: EXECUTABLE });
const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
ctx.setDefaultTimeout(8000);
await blockFonts(ctx);
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
const errs = [];
const go = async (r) => {
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(r + ': ' + String(e).slice(0, 110)));
  await p.goto(BASE + r, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1100);
  await p.locator('button', { hasText: 'Essential only' }).click().catch(() => {});
  await p.waitForTimeout(250);
  return p;
};

// the page exists and is reachable the way a member would find it
{
  const p = await go('/');
  const nav = p.locator('nav button', { hasText: /^Advice$/ }).first();
  check(await nav.count() === 1, 'Advice is in the primary navigation');
  await nav.click(); await p.waitForTimeout(700);
  check(new URL(p.url()).pathname === '/advice', `nav Advice -> ${new URL(p.url()).pathname}`);
  await p.close();
}

// search finds it under the words people actually use
{
  const p = await go('/');
  for (const q of ['financial advice', 'retirement planning', 'wealth', 'financial planning', 'advisor']) {
    await p.keyboard.press('Control+k'); await p.waitForTimeout(350);
    await p.locator('[role="dialog"] input').fill(q); await p.waitForTimeout(350);
    const titles = await p.locator('[role="dialog"] button span:first-child').allTextContents();
    const hit = titles.some(t => /Financial Advice|Financial Planning|Retirement Planning|Wealth Management|Financial Check-Up/.test(t));
    check(hit, `search "${q}" surfaces an advice result (${JSON.stringify(titles.slice(0, 2))})`);
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  }
  await p.close();
}

// every service CTA lands somewhere real
{
  const targets = [
    ['Book a Financial Check-Up', '/booking'],
    ['Compare registered plans', '/accounts'],
    ['Explore investing', '/personal'],
    ['Plan your estate', '/estate'],
    ['Open the tax optimizer', '/tax-optimizer'],
    ['Business solutions', '/business'],
    ['Financial Health Check', '/financial-health-check'],
    ['Retirement Calculator', '/calculators'],
    ['Life Event Simulator', '/life-event-simulator'],
    ['Message Heili', '/messages'],
    ['Find a branch', '/contact'],
  ];
  for (const [label, want] of targets) {
    const p = await go('/advice');
    const b = p.locator('main button', { hasText: label }).first();
    if (await b.count() === 0) { check(false, `"${label}" not found on /advice`); await p.close(); continue; }
    await b.click(); await p.waitForTimeout(650);
    check(new URL(p.url()).pathname === want, `"${label}" -> ${new URL(p.url()).pathname} (want ${want})`);
    await p.close();
  }
}

// the regulatory disclosure has to be on the page itself, not only in the terms
{
  const p = await go('/advice');
  const t = await p.locator('main').innerText();
  check(/not deposits/i.test(t) && /not insured by FSRA/i.test(t) && /may fluctuate in value/i.test(t),
    'investments disclosure is on the page');
  check(/prospectus/i.test(t), 'and points to the prospectus');
  check(/Aviso Wealth/.test(t) && /Qtrade/.test(t) && /VirtualWealth/.test(t),
    'names the same providers the terms page names');
  // nothing invented: the wealth lead is the person the rest of the site names
  check(/Heili Orav/.test(t) && /Wealth & Estate Services/.test(t), 'names the wealth lead the site already names');
  check(!/NaN|undefined|\$\{/.test(t), 'no NaN, undefined or un-interpolated placeholders');
  check(t.length > 1200, `page has real content (${t.length} chars)`);
  await p.close();
}

// it must survive a direct hit and a phone
{
  const p = await go('/advice');
  check((await p.title()).includes('Financial Advice'), `deep link title: ${JSON.stringify(await p.title())}`);
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(700);
  const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  check(o.sw <= o.cw + 1, `no horizontal overflow at 390px (${o.sw} vs ${o.cw})`);
  const small = await p.locator('main button').evaluateAll(bs => bs.filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 24; }).length);
  check(small === 0, `every tap target >= 24px (${small} too small)`);
  await p.close();
}

// advisory has to read as a product area, not a page only the nav knows about
{
  const p = await go('/');
  const txt = await p.locator('main').innerText();
  check(/Advice from people you can meet/.test(txt), 'the home page carries an advice section');
  check(/Financial Check-Up/.test(txt), 'and names the Check-Up on the home page');
  check(/financial advice/i.test(txt), 'the hero copy counts advice among the products');
  check(!/NaN|undefined|\$\{/.test(txt), 'home page has no un-interpolated placeholders');
  await p.close();
}

// every new way in actually arrives at /advice
{
  const entries = [
    ['/', 'Explore Financial Advice'],
    ['/', 'Financial Advice'],          // the product-area grid lower down
    ['/personal', 'Financial advice'],
    ['/estate', 'See our advice services'],
    ['/tax-optimizer', 'Financial advice'],
    ['/calculators', 'Take this to an advisor'],
    ['/booking', 'What a Financial Check-Up covers'],
  ];
  for (const [from, label] of entries) {
    const p = await go(from);
    const b = p.locator('main button', { hasText: label }).first();
    if (await b.count() === 0) { check(false, `"${label}" not found on ${from}`); await p.close(); continue; }
    await b.scrollIntoViewIfNeeded();
    await b.click(); await p.waitForTimeout(700);
    check(new URL(p.url()).pathname === '/advice', `${from} "${label}" -> ${new URL(p.url()).pathname}`);
    await p.close();
  }
}

// and the footer lists it wherever you are
{
  const p = await go('/rates');
  const f = p.locator('footer button', { hasText: 'Financial Advice' }).first();
  check(await f.count() === 1, 'the footer has an Advice column');
  await f.click(); await p.waitForTimeout(700);
  check(new URL(p.url()).pathname === '/advice', `footer Financial Advice -> ${new URL(p.url()).pathname}`);
  await p.close();
}

check(errs.length === 0, `no page errors${errs.length ? ': ' + errs[0] : ''}`);
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
