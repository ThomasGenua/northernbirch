// The site as a visitor meets it once it is deployed: behind the password gate,
// with the real form and chat handlers answering over HTTP.
//
// The other suites serve dist/ with a static file server and stub the endpoints
// in the browser, so they cannot see a bug that only appears when the gate, the
// cookie, the handlers and the pages meet. This one starts the emulator in
// tests/support (the real gate and handlers over a real socket, Anthropic
// stubbed) and drives Chromium through it.
//
// It is NOT Netlify. A pass says the pieces fit together; only
// `scripts/smoke-live.mjs` against the deployed URL says the deployment works.
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { EXECUTABLE, ROOT, blockFonts } from './env.mjs';
import { startEmulator } from '../support/netlify-emulator.mjs';
import { join } from 'node:path';

const PW = 'correct-horse-battery-staple';
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

const br = await chromium.launch({ executablePath: EXECUTABLE });
const emu = await startEmulator({ sitePassword: PW });
const U = emu.url;

async function visitor() {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
  ctx.setDefaultTimeout(8000);
  await blockFonts(ctx);
  return { ctx, p: await ctx.newPage() };
}
const text = async (p) => (await p.locator('main').innerText()).replace(/\s+/g, ' ');
async function signIn(p, to = '/') {
  await p.goto(U + to, { waitUntil: 'domcontentloaded' });
  await p.locator('input[type=password]').fill(PW);
  await Promise.all([p.waitForURL((u) => !u.pathname.startsWith('/__unlock'), { waitUntil: 'domcontentloaded' }), p.locator('input[type=password]').press('Enter')]);
  await p.waitForTimeout(900);
  await p.locator('button', { hasText: 'Essential only' }).click({ timeout: 1500 }).catch(() => {});
}
async function fillForm(p) {
  for (const el of await p.locator('main input:not([type=checkbox]):not([type=range]), main select, main textarea').all()) {
    const t = await el.evaluate((e) => e.tagName + '|' + (e.type || ''));
    if (t.startsWith('SELECT')) { if (await el.locator('option').count() > 1) await el.selectOption({ index: 1 }).catch(() => {}); }
    else if (/email/.test(t)) await el.fill('reviewer@example.com').catch(() => {});
    else if (/\|date/.test(t)) await el.fill('2026-10-15').catch(() => {});
    else if (/tel/.test(t) || /phone/i.test(await el.getAttribute('id') || '')) await el.fill('416-555-0100').catch(() => {});
    else await el.fill('Review Probe').catch(() => {});
  }
  const cb = p.locator('main input[type=checkbox]');
  for (let i = 0; i < await cb.count(); i++) await cb.nth(i).check().catch(() => {});
  await p.waitForTimeout(200);
}
const FORMS = [
  ['/apply', 'Submit application', /Demo complete: application not sent/],
  ['/booking', 'Request Appointment', /Demo complete: appointment not requested/],
  ['/referrals', 'Send Referral', /Demo complete: referral not sent/],
];

// ---------- 1. a stranger gets the password page and nothing else ----------
{
  const { ctx, p } = await visitor();
  const r = await p.goto(U + '/rates', { waitUntil: 'domcontentloaded' });
  check(await p.locator('input[type=password]').count() === 1, 'a stranger asking for /rates is shown the password box');
  check(!(await p.content()).includes('Your whole financial life'), 'and none of the site comes with it');
  check(/noindex/.test(r.headers()['x-robots-tag'] || ''), 'and it asks crawlers to stay out');
  const api = await p.evaluate(async () => { const x = await fetch('/api/demo-intake?form=application', { method: 'POST', body: 'a=b' }); return { s: x.status, t: await x.text() }; });
  check(api.s === 401 && /session expired/i.test(api.t), 'an API call from the unauthenticated page is a 401 JSON, not a page');

  // a wrong password is refused and leaves no cookie
  await p.locator('input[type=password]').fill('not-the-password');
  await p.locator('input[type=password]').press('Enter');
  await p.waitForTimeout(600);
  check((await ctx.cookies()).length === 0, 'a wrong password sets no cookie');
  check(await p.locator('input[type=password]').count() === 1, 'and the password box is still there');
  await ctx.close();
}

// ---------- 2. the right password: lands where they were going, and it sticks ----------
{
  const { ctx, p } = await visitor();
  await signIn(p, '/rates');
  check(new URL(p.url()).pathname === '/rates', 'the right password lands on the page that was asked for');
  check(/illustrative/i.test(await p.locator('main').innerText()), 'and it is the real rates page (it says "illustrative")');
  const ck = (await ctx.cookies()).find((c) => c.name === 'nb_demo_access');
  check(ck && ck.httpOnly && ck.secure && ck.sameSite === 'Lax', 'the session cookie is HttpOnly, Secure and SameSite=Lax');
  await p.reload({ waitUntil: 'domcontentloaded' });
  check(await p.locator('input[type=password]').count() === 0, 'a reload stays signed in');
  const missing = await p.goto(U + '/no-such-page', { waitUntil: 'domcontentloaded' });
  check(missing.status() === 404, 'an unknown URL, signed in, is a real 404');
  await ctx.close();
}

// ---------- 3. the three forms, end to end through the real intake handler ----------
for (const [route, submit, heading] of FORMS) {
  const { ctx, p } = await visitor();
  await signIn(p, route);
  await fillForm(p);
  const posted = p.waitForResponse((r) => r.url().includes('/api/demo-intake'));
  await p.locator('main button', { hasText: submit }).first().click();
  const resp = await posted;
  const body = await resp.json().catch(() => null);
  check(resp.status() === 200 && body && body.ok === true && body.stored === false, `${route}: the real handler answers "ok, not stored" (${resp.status()})`);
  await p.waitForTimeout(500);
  check(heading.test(await text(p)), `${route}: and the screen says the demo did not send anything`);
  await ctx.close();
}

// ---------- 4. the session expires while the form is open ----------
{
  const { ctx, p } = await visitor();
  await signIn(p, '/apply');
  await fillForm(p);
  await ctx.clearCookies();   // what an expired 12-hour session looks like to the page
  await p.locator('main button', { hasText: 'Submit application' }).first().click();
  await p.waitForTimeout(900);
  const t = await text(p);
  check(!/Demo complete/.test(t) && /could not send|Nothing has been/i.test(t), 'expired session: the form shows an error, not a success screen');
  await ctx.close();
}

// ---------- 5. the chat widget through the real chat handler ----------
async function ask(p, question) {
  await p.locator('[aria-label="Open the Northern Birch AI assistant"]').click({ force: true });
  await p.waitForTimeout(400);
  const box = p.locator('input[aria-label="Ask the Northern Birch assistant a question"]');
  await box.fill(question);
  await box.press('Enter');
  await p.waitForTimeout(1200);
  return (await p.locator('body').innerText()).replace(/\s+/g, ' ');
}
{
  const { ctx, p } = await visitor();
  await signIn(p, '/');
  emu.upstreamCalls.length = 0;
  const body = await ask(p, 'What accounts do you offer?');
  check(/Stub reply from the emulator/.test(body), 'chat: the answer that came back through the real handler is shown');
  const call = emu.upstreamCalls[0];
  check(call && call.roles[0] === 'user', `chat: the first message sent upstream is the visitor's, not the widget's greeting (${call && call.roles.join(',')})`);
  check(call && call.firstUser === 'What accounts do you offer?' && call.hasKeyHeader, 'chat: the visitor\'s words and the API key header reached the upstream call');
  check(call && /^claude-/.test(call.model) && call.max_tokens > 0 && call.max_tokens <= 2000, `chat: a real model name and a capped answer length (${call && call.model}, ${call && call.max_tokens})`);
  await ctx.close();
}
{
  const { ctx, p } = await visitor();
  await signIn(p, '/');
  emu.setUpstream(() => ({ status: 500, body: { error: { message: 'upstream down' } } }));
  const body = await ask(p, 'Hello there');
  check(/isn't available right now/.test(body) && !/upstream down/.test(body), 'chat: when the AI service fails the visitor is told it is unavailable, and sees no internals');
  emu.setUpstream(() => ({ status: 200, body: { content: [{ type: 'text', text: 'Stub reply from the emulator.' }], stop_reason: 'end_turn' } }));
  await ctx.close();
}

// ---------- 6. the lockout, over HTTP ----------
{
  emu.resetThrottle();
  const post = (pw) => fetch(U + '/__unlock', { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ password: pw, next: '/' }) });
  let last;
  for (let i = 0; i < 10; i++) last = await post('wrong-' + i);
  const locked = await post(PW);   // even the right one, once locked
  check(last.status === 401 && locked.status === 429 && Number(locked.headers.get('retry-after')) > 0, `lockout: after 10 wrong passwords even the right one gets 429 with Retry-After (${locked.status})`);
  emu.resetThrottle();
  const ok = await post(PW);
  check(ok.status === 303, 'lockout: and the counter clearing lets the right password in again');
}

// ---------- 7. SITE_PASSWORD missing: closed, not open ----------
{
  const bare = await startEmulator({ sitePassword: null });
  const r = await fetch(bare.url + '/', { redirect: 'manual' });
  const body = await r.text();
  check(r.status === 503 && !/Your whole financial life/.test(body), 'with SITE_PASSWORD unset the site answers 503 and serves nothing');
  await bare.close();
}

// ---------- 8. the owner's smoke script, run against the emulator ----------
// Async spawn on purpose: the emulator lives in THIS process, so a blocking
// spawn would stop it answering and deadlock.
{
  const run = (args) => new Promise((resolve) => {
    let out = '';
    const c = spawn(process.execPath, [join(ROOT, 'scripts', 'smoke-live.mjs'), ...args], { env: { ...process.env, SMOKE_URL: U, SITE_PASSWORD: PW } });
    c.stdout.on('data', (d) => { out += d; }); c.stderr.on('data', (d) => { out += d; });
    c.on('close', (code) => resolve({ code, out }));
  });
  emu.resetThrottle();
  const plain = await run([]);
  check(plain.code === 0 && /\d+ passed, 0 failed/.test(plain.out), `smoke-live: passes against the emulator (${(plain.out.match(/\d+ passed, \d+ failed/) || ['no summary'])[0]})`);
  check(!plain.out.includes(PW), 'smoke-live: never prints the password');
  emu.resetThrottle();
  const withAi = await run(['--ai']);
  check(withAi.code === 0 && /answer: Stub reply/.test(withAi.out), 'smoke-live --ai: also makes the one chat call and checks the answer');
  const wrong = await new Promise((resolve) => {
    let out = '';
    const c = spawn(process.execPath, [join(ROOT, 'scripts', 'smoke-live.mjs')], { env: { ...process.env, SMOKE_URL: U, SITE_PASSWORD: 'definitely-wrong' } });
    c.stdout.on('data', (d) => { out += d; }); c.stderr.on('data', (d) => { out += d; });
    c.on('close', (code) => resolve({ code, out }));
  });
  check(wrong.code !== 0, 'smoke-live: with the wrong password it fails (exit code is not 0) instead of passing quietly');
}

console.log(`\n${pass} passed, ${fail} failed`);
await emu.close();
await br.close();
process.exit(fail ? 1 : 0);
