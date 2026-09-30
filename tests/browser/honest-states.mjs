// A screen may only say what actually happened.
//
// A review of this site found forms that told a visitor "you'll receive a
// confirmation email" when nothing had been sent, a form that reported success
// after the password session expired (the gate answered the POST with its own
// page and a 200), a sign-in box on a lookalike site, an AI failure dressed up
// as a finished analysis, and notifications about a claim approval and a
// delivered transfer that Northern Birch does not do. The suites that existed
// checked that the buttons worked, not that the words were true. These do.
//
// The endpoints are stubbed here (the static server behind the suites serves
// files only), so what is checked is the page's handling of each answer.
import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br = await chromium.launch({ executablePath: EXECUTABLE });
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

const INTAKE_OK = JSON.stringify({ ok: true, stored: false, message: 'This is a demonstration. Your details were not saved, sent, or shared with anyone.' });
const GATE_PAGE = '<!doctype html><html><body><h1>Password</h1><form method="POST" action="/__unlock"><input type="password" name="password"></form></body></html>';
const SESSION_EXPIRED = JSON.stringify({ error: 'Session expired. Reload the page and sign in again.' });

async function newPage(route, setup) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
  ctx.setDefaultTimeout(7000);
  await blockFonts(ctx);
  if (setup) await setup(ctx);
  const p = await ctx.newPage();
  await p.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1000);
  await p.locator('button', { hasText: 'Essential only' }).click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(200);
  return { ctx, p };
}
const text = async (p) => (await p.locator('main').innerText()).replace(/\s+/g, ' ');

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
  ['/apply', 'Submit application', /Demo complete: application not sent/, /nobody will call you/i, /(?<!would )(?:advisor calls you|we have your request|nothing is open yet)/i],
  ['/booking', 'Request Appointment', /Demo complete: appointment not requested/, /no confirmation email is coming/i, /you'll receive a confirmation email|we have received your request/i],
  ['/referrals', 'Send Referral', /Demo complete: referral not sent/, /no invitation email is coming/i, /will receive an invitation email|referral sent!/i],
];

// ---------- 1. a successful answer: the screen says it is a demo ----------
for (const [route, submit, heading, honest, promise] of FORMS) {
  const { ctx, p } = await newPage(route, (c) => c.route('**/api/demo-intake*', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: INTAKE_OK })));
  await fillForm(p);
  await p.locator('main button', { hasText: submit }).first().click();
  await p.waitForTimeout(900);
  const t = await text(p);
  check(heading.test(t), `${route}: success screen says the demo did not send anything`);
  check(honest.test(t), `${route}: and says what will not happen (${honest})`);
  check(!promise.test(t), `${route}: and promises no call, email or invitation`);
  check(/416-465-4659/.test(t), `${route}: and gives the real number to do it for real`);
  await ctx.close();
}

// ---------- 2. an answer that is not the intake's own "ok": no success ----------
const BAD_ANSWERS = [
  ['the password page with a 200 (expired session, old gate)', { status: 200, contentType: 'text/html', body: GATE_PAGE }],
  ['a 401 session-expired JSON (current gate)', { status: 401, contentType: 'application/json', body: SESSION_EXPIRED }],
  ['a 200 JSON without ok:true', { status: 200, contentType: 'application/json', body: '{"message":"hello"}' }],
  ['a 500', { status: 500, contentType: 'text/plain', body: 'boom' }],
];
for (const [label, answer] of BAD_ANSWERS) {
  for (const [route, submit, heading] of FORMS) {
    const { ctx, p } = await newPage(route, (c) => c.route('**/api/demo-intake*', (r) => r.fulfill(answer)));
    await fillForm(p);
    await p.locator('main button', { hasText: submit }).first().click();
    await p.waitForTimeout(900);
    const t = await text(p);
    check(!heading.test(t) && /could not send|Nothing has been/i.test(t), `${route}: ${label} -> an error, not a success screen`);
    await ctx.close();
  }
}

// ---------- 3. the member area: no credentials asked for ----------
{
  const { ctx, p } = await newPage('/');
  await p.locator('button', { hasText: 'Try the demo' }).first().click();
  await p.waitForTimeout(500);
  const d = p.locator('[role="dialog"]');
  const dt = (await d.innerText()).replace(/\s+/g, ' ');
  check(await d.locator('input').count() === 0, 'access demo: the dialog has no input fields at all');
  check(/no sign-in on this demonstration/i.test(dt) && /never type your real member number or password/i.test(dt), 'access demo: says there is no sign-in and warns against typing real credentials');
  await d.locator('button', { hasText: 'Open the demo dashboard' }).click();
  await p.waitForTimeout(600);
  check(new URL(p.url()).pathname === '/dashboard', 'access demo: the button opens the dashboard');
  await ctx.close();
}

// ---------- 4. the dashboard wire request ----------
{
  const { ctx, p } = await newPage('/dashboard');
  await p.locator('input[aria-label="Transfer amount in Canadian dollars"]').fill('300');
  await p.locator('main button', { hasText: /^Request a C\$300/ }).click();
  await p.waitForTimeout(400);
  const t = await text(p);
  check(/Demo only: no request was sent/.test(t) && /nobody will call/i.test(t), 'dashboard wire: says nothing was sent and nobody will call');
  check(!/Request reference|Tracking ID|NB-TXN|Transfer Sent!|Request sent to your branch|Estimated arrival/i.test(t), 'dashboard wire: shows no invented reference number or "sent" claim');
  await ctx.close();
}

// ---------- 5. an AI failure is an error, then it can be retried ----------
{
  let calls = 0;
  const { ctx, p } = await newPage('/life-event-simulator', (c) => c.route('**/api/chat', (r) => {
    calls++;
    if (calls === 1) return r.fulfill({ status: 502, contentType: 'application/json', body: '{"error":"x"}' });
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ content: [{ type: 'text', text: 'PLAN: a stub action plan.' }] }) });
  }));
  await p.locator('main button', { hasText: 'Having a baby' }).click();
  await p.waitForTimeout(900);
  const a = await text(p);
  check(/isn't available right now/.test(a) && !/AI-generated action plan/.test(a), 'AI failure: shows an error, not an "AI-generated" result');
  check(!/Download Action Plan/.test(a), 'AI failure: offers no PDF of the error');
  await p.locator('main button', { hasText: 'Try again' }).click();
  await p.waitForTimeout(900);
  const b = await text(p);
  check(/a stub action plan/.test(b) && calls === 2, `AI failure: "Try again" makes a second call and shows the result (${calls} calls)`);
  await ctx.close();
}
for (const [route, sample, go] of [['/coverage-analyzer', 'Young couple', 'Analyze My Coverage'], ['/policy-document-reader', 'Home insurance renewal', 'Analyze My Policy'], ['/tax-optimizer', 'Maximize RRSP deductions', 'Optimize My Taxes']]) {
  const { ctx, p } = await newPage(route, (c) => c.route('**/api/chat', (r) => r.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"x"}' })));
  await p.locator('main button', { hasText: sample }).first().click();
  await p.locator('main button', { hasText: go }).first().click();
  await p.waitForTimeout(900);
  const t = await text(p);
  check(/isn't available right now/.test(t) && !/Analysis Complete|Policy Analysis Complete/.test(t), `${route}: a failed call is an error, not "Complete"`);
  await ctx.close();
}

// ---------- 6. AI replies in Messages are labelled, and a failure is a notice ----------
{
  const { ctx, p } = await newPage('/messages', (c) => c.route('**/api/chat', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ content: [{ type: 'text', text: 'A stub reply.' }] }) })));
  await p.locator('main input, main textarea').first().fill('Hello');
  await p.locator('main button', { hasText: /^Send$/ }).click();
  await p.waitForTimeout(800);
  check(/AI demo reply/.test(await text(p)), 'messages: a model reply is labelled as an AI demo reply');
  await ctx.close();
}
{
  const { ctx, p } = await newPage('/messages', (c) => c.route('**/api/chat', (r) => r.fulfill({ status: 502, contentType: 'application/json', body: '{}' })));
  await p.locator('main input, main textarea').first().fill('Hello');
  await p.locator('main button', { hasText: /^Send$/ }).click();
  await p.waitForTimeout(800);
  const t = await text(p);
  check(/Notice/.test(t) && /isn't available right now/.test(t), 'messages: a failure is a system notice, not words from Heili');
  await ctx.close();
}

// ---------- 7. the chat widget and the notifications bell ----------
{
  const { ctx, p } = await newPage('/');
  await p.locator('[aria-label="Open the Northern Birch AI assistant"]').click({ force: true });
  await p.waitForTimeout(500);
  const body = (await p.locator('body').innerText()).replace(/\s+/g, ' ');
  const greeting = body.match(/Hello! I'm Northern Birch's AI assistant[^?]*\?/)?.[0] || '';
  check(greeting !== '', 'widget: the greeting is shown');
  check(!/recommendation|mortgage rates/i.test(greeting), 'widget: the greeting does not offer recommendations or rates, which the assistant may not give');
  check(/can't give quotes, advice or today's rates/i.test(greeting), 'widget: it says what it cannot do');
  await ctx.close();
}
{
  const { ctx, p } = await newPage('/');
  await p.locator('button[aria-label="Notifications"]:visible').first().click();
  await p.waitForTimeout(500);
  const t = (await p.locator('[role="dialog"]').innerText()).replace(/\s+/g, ' ');
  check(!/Claim #|approved|deposited/i.test(t), 'notifications: no claim approval or deposit (Northern Birch does not handle claims)');
  check(!/transfer[^.]*(delivered|received)/i.test(t), 'notifications: no delivered online transfer (wires are sent in branch)');
  check(/Euro Cash Order Ready/.test(t) && /Card Includes Travel Cover/.test(t), 'notifications: the replacements are the real products (advance euro order, card travel cover)');
  await ctx.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
