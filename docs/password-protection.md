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

The browser shows its own username/password prompt. Only the password is
checked; the username box can be left blank. Do not put a colon in the
username — HTTP Basic auth splits the credentials on the first colon, so a
username containing one will send the wrong password.

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

## Turning it off

Delete `netlify/edge-functions/password-gate.js` and its test, and remove the
test from the `test` script in `package.json`. Nothing else references it.

Note that while the gate is on, search engines get a 401 and the site will drop
out of search results. The prerendering, sitemap and per-page meta all still
work; they simply have no audience until the gate comes off.

## Tests

`netlify/edge-functions/password-gate.test.mjs`, run by `npm test`. It covers
what gets in, what does not, the malformed and misconfigured cases, and the 401
response itself. The browser suites cannot reach this code — they run against a
local static server, while this runs on Netlify's edge — so this file is the
only thing standing behind it.
