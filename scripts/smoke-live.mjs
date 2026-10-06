// A smoke test for the DEPLOYED site. Run it yourself, after a deploy:
//
//   SMOKE_URL=https://your-site.netlify.app SITE_PASSWORD=... node scripts/smoke-live.mjs
//   SMOKE_URL=... SITE_PASSWORD=... node scripts/smoke-live.mjs --ai     # also makes ONE real AI call
//
// It checks what only a real deployment can answer and the local suites cannot:
// that the password gate is actually in front of the site, that the cookie it
// sets has the right flags, that the security headers Netlify applies are
// present, that a form post reaches the function and is discarded, that an
// unknown URL is a real 404, and (with --ai) that ANTHROPIC_API_KEY is set and
// the chat endpoint returns an answer that follows the rules.
//
// It reads the password and the URL from the environment and never prints the
// password. It sends one demo form post with obviously fake data (which the
// function discards) and, with --ai, one short question -- a real API call on
// your key. It changes nothing else. Exit code 0 means every check passed.
//
// tests/browser/deployed-shape.mjs runs this same script against a local
// emulator, which is how the script itself is tested. That is not a substitute
// for running it against the real site.
const base = (process.env.SMOKE_URL || '').replace(/\/+$/, '');
const password = process.env.SITE_PASSWORD || '';
const ai = process.argv.includes('--ai');
if (!/^https?:\/\//.test(base) || !password) {
  console.error('Set SMOKE_URL (the site, e.g. https://example.netlify.app) and SITE_PASSWORD, then run again.');
  process.exit(2);
}

let pass = 0, fail = 0, skipped = 0;
const check = (ok, name, detail = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? '\n        ' + detail : ''}`); };
const note = (name) => { skipped++; console.log(`SKIP  ${name}`); };
const get = (path, headers = {}, init = {}) => fetch(base + path, { redirect: 'manual', headers, ...init });

// ---- 1. the gate is in front of everything ----
{
  const home = await get('/');
  const body = await home.text();
  check(home.status === 200 && /<input[^>]+type="password"/i.test(body), 'an unauthenticated visitor gets the password page, not the site', `status ${home.status}`);
  check(!/Your whole financial life/.test(body), 'and none of the site\'s content comes with it');
  check(/noindex/.test(home.headers.get('x-robots-tag') || ''), 'the password page tells crawlers to stay out (X-Robots-Tag)');
  check(home.headers.get('cache-control') === 'no-store', 'and is not cacheable');
  const asset = await get('/assets/' + 'does-not-matter.js');
  check(/<input[^>]+type="password"/i.test(await asset.text()), 'a static asset path is gated too');
  const api = await get('/api/demo-intake?form=application', {}, { method: 'POST', body: 'bot-field=' });
  check(api.status === 401 && /session expired/i.test(await api.text()), 'an API call without a session is a 401 JSON, not a 200 page');
  const wrong = await get('/__unlock', { 'content-type': 'application/x-www-form-urlencoded' }, { method: 'POST', body: new URLSearchParams({ password: 'not-the-password', next: '/' }) });
  check(wrong.status === 401 && !wrong.headers.get('set-cookie'), 'a wrong password is refused and sets no cookie', `status ${wrong.status}`);
}

// ---- 2. unlock ----
let cookie = '';
{
  const ok = await get('/__unlock', { 'content-type': 'application/x-www-form-urlencoded' }, { method: 'POST', body: new URLSearchParams({ password, next: '/rates' }) });
  const setCookie = ok.headers.get('set-cookie') || '';
  check(ok.status === 303, 'the right password redirects (303)', `status ${ok.status} -- if 503, SITE_PASSWORD is not set on the site; if 429, you are locked out for 15 minutes`);
  check(ok.headers.get('location') === '/rates', 'back to the page that was asked for');
  check(/HttpOnly/i.test(setCookie) && /Secure/i.test(setCookie) && /SameSite=Lax/i.test(setCookie), 'the session cookie is HttpOnly, Secure and SameSite=Lax');
  cookie = setCookie.split(';')[0];
}
if (!cookie) { console.error('\nCould not sign in, so the remaining checks cannot run.'); process.exit(1); }
const authed = { cookie };

// ---- 3. the site, signed in ----
{
  const home = await get('/', authed);
  const html = await home.text();
  check(home.status === 200 && /Demonstration only/.test(html), 'signed in, the home page loads and carries the demo banner');
  check(/noindex/.test(html), 'and is marked noindex');
  const h = home.headers;
  check(/max-age=\d+/.test(h.get('strict-transport-security') || ''), 'Strict-Transport-Security is set', String(h.get('strict-transport-security')));
  check(h.get('x-frame-options') === 'DENY' && h.get('x-content-type-options') === 'nosniff', 'X-Frame-Options and X-Content-Type-Options are set');
  check(/frame-ancestors 'none'/.test(h.get('content-security-policy') || ''), 'Content-Security-Policy is set');
  for (const path of ['/rates', '/proposal', '/claims', '/estate']) {
    const r = await get(path, authed);
    check(r.status === 200, `${path} is a real page (200)`, `status ${r.status}`);
  }
  const rates = await (await get('/rates', authed)).text();
  check(/illustrative/i.test(rates), 'the rates page marks unconfirmed rates "illustrative"');
  const missing = await get('/this-page-does-not-exist', authed);
  check(missing.status === 404, 'an unknown URL is a real 404, not the home page with a 200', `status ${missing.status}`);
}

// ---- 4. a form post reaches the function and is discarded ----
{
  const r = await get('/api/demo-intake?form=application', { ...authed, 'content-type': 'application/x-www-form-urlencoded' }, { method: 'POST', body: new URLSearchParams({ 'bot-field': '', product: 'Chequing account', name: 'SMOKE TEST', email: 'smoke@example.invalid', phone: '000-000-0000', consent: 'yes' }) });
  let j = null; try { j = await r.json(); } catch { /* not JSON */ }
  check(r.status === 200 && j && j.ok === true && j.stored === false, 'a form post reaches /api/demo-intake and is answered "ok, not stored"', `status ${r.status} ${JSON.stringify(j)}`);
}

// ---- 5. the AI endpoint ----
{
  const refused = await get('/api/chat', { ...authed, 'content-type': 'application/json' }, { method: 'POST', body: JSON.stringify({ feature: 'no-such-feature', messages: [{ role: 'user', content: 'hi' }] }) });
  check(refused.status === 400, 'the chat endpoint refuses an unknown feature (400)', `status ${refused.status}`);
  if (!ai) {
    note('the live AI call (run with --ai to make one real call on your API key)');
  } else {
    const r = await get('/api/chat', { ...authed, 'content-type': 'application/json' }, { method: 'POST', body: JSON.stringify({ feature: 'chat', messages: [{ role: 'assistant', content: 'Hello! How can I help?' }, { role: 'user', content: 'In one sentence, what can you help me with?' }] }) });
    let j = null; try { j = await r.json(); } catch { /* not JSON */ }
    const text = (j?.content || []).map((b) => b?.text || '').join(' ').trim();
    check(r.status === 200 && text.length > 0, 'a real chat question gets a real answer (this also proves ANTHROPIC_API_KEY is set and the first-turn handling is accepted by the API)', `status ${r.status} ${r.status === 503 ? '-- ANTHROPIC_API_KEY is not set' : r.status === 502 ? '-- the API refused the request: see the function log' : ''}`);
    if (text) console.log(`        answer: ${text.slice(0, 200)}${text.length > 200 ? '...' : ''}`);
    check(!/STANDING RULES|referral channel, not an advisor/.test(text), 'the answer does not echo the system prompt');
    check(!/\b\d{1,2}\.\d{2}\s?%/.test(text), 'and quotes no rate (the assistant is told never to)');
  }
}

console.log(`\n${pass} passed, ${fail} failed${skipped ? `, ${skipped} skipped` : ''}`);
process.exit(fail ? 1 : 0);
