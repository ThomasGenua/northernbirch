# Password protection

The whole site sits behind one shared password, enforced by
`netlify/edge-functions/password-gate.js`.

## Setting the password

Set `SITE_PASSWORD` in the Netlify UI: **Site configuration → Environment
variables → Add a variable**. It takes effect on the next deploy; no code
change is needed, and changing it later needs no deploy of its own beyond the
next one.

**Set it before deploying the gate.** The password is deliberately not written
down in this repository — this repo is public, so a literal in the source would
be readable by exactly the people the gate exists to keep out, and would remain
in the git history after any later change. There is therefore no fallback: if
`SITE_PASSWORD` is missing the gate denies *everyone*, which is the right way
for it to fail but will look like an outage. The reason is written to the
Netlify function log, not shown to visitors.

## Signing in

A branded password page, served at whatever URL the visitor asked for. It
states plainly that this is an Oodler demonstration and not a real bank
website — before anyone types anything — then takes a password and, on
success, sets a signed cookie and sends them on to the page they wanted. The
cookie lasts 12 hours.

An earlier version of this used HTTP Basic auth, which put the browser's own
credential dialog in front of the site. That was wrong for a client-facing
demo: the dialog cannot be branded, cannot explain what the site is, is
indistinguishable from a phishing prompt or a server error to a
non-technical visitor, and leaves a bare error page if they press Cancel.

## Why an edge function rather than JavaScript on the page

Every route is prerendered to static HTML at build time, so the entire site —
rates, branch addresses, staff names — is in the markup before any JavaScript
runs. A password check in the page could only hide that behind a `div`, one
"view source" away. The edge function runs before Netlify serves the file, so
an unauthenticated visitor never receives the content at all.

Netlify has built-in password protection that does the same job from the UI,
but it is a paid-plan feature. This works on any plan. If the site moves to a
plan that includes it, prefer the built-in one and delete this function.

## What it covers

`config.path = "/*"` — every page, asset, `/api/chat` and form post. Nothing is
excluded; an exception would be served to anyone who guessed its URL.

The cookie is an expiry signed with HMAC-SHA256, keyed on the password itself,
so it cannot be forged by someone who does not already know the password and
cannot have its expiry edited. `next=` is restricted to same-site paths, so the
form cannot be turned into an open redirect.

## Expired sessions and the API

A request to `/api/*` without a valid cookie is answered `401` with a JSON body
(`{"error":"Session expired..."}`), not the password page. The site's forms and
AI tools call those endpoints; the password page with a `200` made an expired
session look like a successful submission. The forms now also require the
intake's own `{"ok":true}` before showing anything.

## Guessing

After 10 wrong passwords from one address the gate answers `429` (with
`Retry-After`) for 15 minutes, and refuses the right password too while it
does. It is held in each edge instance's memory, so it bounds a guesser rather
than stopping a determined one; a shared store would be needed for that.

## Turning it off

Delete `netlify/edge-functions/password-gate.js` and its test, and remove the
test from the `test` script in `package.json`. Nothing else references it.

Note that while the gate is on, search engines get a 401 and the site will drop
out of search results. The prerendering, sitemap and per-page meta all still
work; they simply have no audience until the gate comes off.

## Tests

Three layers, each answering a different question.

- `netlify/edge-functions/password-gate.test.mjs`, run by `npm test`: the gate
  logic on its own. It serves a page rather than a browser dialog, says it is a
  demo, unlocks with the right flags on the cookie, rejects forged and expired
  cookies, refuses open-redirect and markup-injection attempts, locks out after
  repeated wrong guesses, and fails closed when no password is set.
- `tests/browser/deployed-shape.mjs`: the gate, the cookie, the real form and
  chat handlers and the built pages together, in Chromium, over HTTP. It uses
  `tests/support/netlify-emulator.mjs`, a stand-in for Netlify with Anthropic
  stubbed. **It is not Netlify**: it does not run on Netlify's runtime, read
  Netlify's environment or call Anthropic, so a pass says the pieces fit, not
  that the deployment works.
- `scripts/smoke-live.mjs`: the only check against the real deployment. Run it
  yourself after a deploy, because it needs the password and, with `--ai`, makes
  one real call on your Anthropic key:

  ```
  SMOKE_URL=https://your-site.netlify.app SITE_PASSWORD=... node scripts/smoke-live.mjs
  SMOKE_URL=... SITE_PASSWORD=... node scripts/smoke-live.mjs --ai
  ```

  It checks that the gate is in front of everything, the cookie flags, the
  security headers, that pages and a real 404 come back as they should, that a
  form post is accepted and discarded, and (with `--ai`) that
  `ANTHROPIC_API_KEY` is set and the assistant answers. It never prints the
  password. Exit code 0 means every check passed; 2 means the variables above
  were not set. Ten wrong passwords from one address lock it out for 15
  minutes, so do not run it with a guessed password.
