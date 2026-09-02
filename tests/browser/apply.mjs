// The application flow. Until this existed, every "Open an Account", "Apply
// for a Credit Card" and "Get Pre-Approved" button led to the appointment form.
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
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

// the buttons that used to dead-end now reach the application, pre-filled
{
  const routes = [
    ['/accounts', 'Open an Account', 'Chequing account'],
    ['/mortgages', 'Get Pre-Approved', 'Mortgage pre-approval'],
    ['/cards', 'Apply for this card', 'Credit card'],
  ];
  for (const [from, labelText, expected] of routes) {
    const p = await go(from);
    const b = p.locator('main button', { hasText: labelText }).first();
    if (await b.count() === 0) { check(false, `"${labelText}" not found on ${from}`); await p.close(); continue; }
    await b.scrollIntoViewIfNeeded(); await b.click(); await p.waitForTimeout(800);
    check(new URL(p.url()).pathname === '/apply', `${from} "${labelText}" -> ${new URL(p.url()).pathname}`);
    const sel = await p.locator('#apply-product').inputValue().catch(() => '');
    check(sel === expected, `and arrives asking for "${sel}" (want "${expected}")`);
    await p.close();
  }
}

// a direct visit starts blank -- the intent is read once, not remembered
{
  const p = await go('/accounts');
  await p.locator('main button', { hasText: 'Open an Account' }).first().click(); await p.waitForTimeout(800);
  await p.goto(BASE + '/apply', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1000);
  check(await p.locator('#apply-product').inputValue() === '', 'a later direct visit to /apply starts blank');
  await p.close();
}

// the form itself
{
  const p = await go('/apply');
  const txt = await p.locator('main').innerText();
  check(/never ask for your SIN/i.test(txt), 'the page says what it will never ask for');
  check(!/social insurance number|date of birth/i.test(txt.replace(/never ask[^.]*\./i, '')), 'and asks for none of it');
  check(await p.locator('main input, main select, main textarea').count() >= 8, 'the form has its fields');

  // every control is labelled -- the site-wide rule
  const unlabelled = await p.locator('main input, main select, main textarea').evaluateAll(els =>
    els.filter(e => e.type !== 'hidden' && !e.getAttribute('aria-label') &&
      !(e.id && document.querySelector(`label[for="${CSS.escape(e.id)}"]`))).length);
  check(unlabelled === 0, `every control is labelled (${unlabelled} are not)`);

  // it will not submit half-filled
  const submitBtn = p.locator('main button', { hasText: /Submit application/ }).first();
  await submitBtn.click(); await p.waitForTimeout(500);
  let t2 = await p.locator('main').innerText();
  check(!/Application started/.test(t2), 'an empty form does not submit');
  check(/we still need what you are applying for/.test(t2), 'and says what is missing rather than greying out');

  await p.locator('#apply-product').selectOption('Credit card');
  await p.locator('#apply-member').selectOption('No, I would be joining');
  await p.locator('#apply-name').fill('Test Person');
  await p.locator('#apply-email').fill('test@example.com');
  await p.locator('#apply-phone').fill('416-555-0100');
  await submitBtn.click(); await p.waitForTimeout(500);
  t2 = await p.locator('main').innerText();
  check(!/Application started/.test(t2), 'and neither does one without consent');
  check(/your consent to be contacted/.test(t2), 'naming consent as the one thing left');

  // consent given, submission attempted -- the dev server has no form handler,
  // so this must fail visibly rather than pretending it worked
  await p.locator('#apply-consent').check();
  await submitBtn.click(); await p.waitForTimeout(1200);
  const after = await p.locator('main').innerText();
  check(/could not send|Application started/.test(after), 'a complete form either submits or says plainly that it did not');
  check(!/NaN|undefined|\$\{/.test(after), 'no NaN, undefined or un-interpolated placeholders');
  await p.close();
}

// Netlify only accepts a form it found in the built HTML at deploy time
{
  const html = readFileSync(new URL('../../dist/index.html', import.meta.url), 'utf8');
  const m = html.match(/<form name="application"[\s\S]*?<\/form>/);
  check(!!m, 'the built HTML registers the application form with Netlify');
  if (m) {
    const declared = [...m[0].matchAll(/name="([^"]+)"/g)].map(x => x[1]);
    const sent = ['product', 'member', 'branch', 'name', 'email', 'phone', 'reach', 'notes', 'consent', 'consentVersion', 'bot-field'];
    const missing = sent.filter(f => !declared.includes(f));
    check(missing.length === 0, `every field the app sends is declared${missing.length ? ': ' + JSON.stringify(missing) : ''}`);
    check(declared.includes('bot-field'), 'including the honeypot');
    check(!/name="(sin|dob|birth|password|accountNumber)"/i.test(m[0]), 'and nothing sensitive is collected');
  }
}

// reachable the way people look for it, and usable on a phone
{
  const p = await go('/');
  check(await p.locator('nav button:visible', { hasText: /^Apply$/ }).count() >= 1, 'Apply is in the primary navigation');
  await p.keyboard.press('Control+k'); await p.waitForTimeout(350);
  await p.locator('[role="dialog"] input').fill('open an account'); await p.waitForTimeout(400);
  const titles = await p.locator('[role="dialog"] button span:first-child').allTextContents();
  check(titles.some(t => /Apply Online|Open an Account/.test(t)), `search finds it (${JSON.stringify(titles.slice(0, 2))})`);
  await p.keyboard.press('Escape');
  const f = p.locator('footer button', { hasText: 'Apply Online' }).first();
  check(await f.count() === 1, 'and the footer lists it');
  await p.close();

  const m = await go('/apply');
  await m.setViewportSize({ width: 390, height: 844 }); await m.waitForTimeout(700);
  const o = await m.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  check(o.sw <= o.cw + 1, `no horizontal overflow at 390px (${o.sw} vs ${o.cw})`);
  const small = await m.locator('main button').evaluateAll(bs => bs.filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 24; }).length);
  check(small === 0, `every tap target >= 24px (${small} too small)`);
  check((await m.title()).includes('Apply'), `deep link title: ${JSON.stringify(await m.title())}`);
  await m.close();
}

check(errs.length === 0, `no page errors${errs.length ? ': ' + errs[0] : ''}`);
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
