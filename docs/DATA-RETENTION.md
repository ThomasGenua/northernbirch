# What this site stores

Short answer: **nothing about any visitor.**

This site is a demonstration prepared by Oodler Inc. It carries Northern Birch
Credit Union's name and branding, so anyone looking at it may reasonably
believe it is real and behave accordingly. That makes "we keep nothing" a
requirement rather than a convenience, and this page is the auditable version
of that claim.

## Forms

The four forms — application, booking, claim, referral — ask for a name, an
email address, a phone number and free text.

They post to `/api/demo-intake` (`netlify/functions/demo-intake.mjs`), which
reads the *field names* only, checks that the form is one of the four and that
no forbidden field is present, and returns a success response. **The values are
never read, never written, never forwarded and never logged.** The submission
does not exist a millisecond after the response is sent.

Enforced by `netlify/functions/demo-intake.test.mjs` (28 assertions), which
asserts against the source itself that it does not read a submitted value, does
not call `console.*`, and does not `fetch` anywhere.

### Previously

These were Netlify Forms. `index.html` carried a hidden declaration of each,
and Netlify stored every submission in its form store. That is now removed —
and the removal matters more than the repointing, because a declaration is what
creates the store: with none declared, even a hand-crafted `POST /` has nowhere
to land. `scripts/check-routes.mjs` fails the build if one reappears.

### Fields that are never collected

`sin`, `socialInsurance`, `dateOfBirth`, `password`, `accountNumber`,
`cardNumber`, `cvv`, `transitNumber`.

Checked twice on purpose: `check-routes.mjs` stops one being written into a
form at build time, and `demo-intake.mjs` refuses a request carrying one at
runtime, in case someone crafts a POST by hand.

## The AI assistant

`netlify/functions/chat.mjs` proxies to the Anthropic API.

- **No transcript is stored.** Conversations are relayed and discarded; there is
  no database, no log of message content, and no analytics on what was asked.
- The browser sends a feature key and the turns, never a system prompt — the
  prompts live server-side so the endpoint cannot be repurposed as a general
  LLM on the credit union's key.
- Limits: 20 turns, 24,000 characters, 20 requests per minute per IP.
- Replies that echo the system prompt are withheld before they reach the
  browser, so the standing rules cannot be talked out of the proxy.
- Errors are logged without message content. Upstream error bodies are never
  relayed: they can carry account and request detail.

Conversations do reach Anthropic, who process them under their own terms. That
is the one place where anything a visitor types leaves this site, and it is why
the assistant is told never to ask for personal information.

## Analytics

Plausible, and only after the visitor accepts the cookie banner
(`analyticsAllowed()`). It is cookieless and records no personal data. With no
`VITE_PLAUSIBLE_DOMAIN` configured the script is never loaded at all, and the
site contacts nobody.

Form events record *which* form was submitted and whether it succeeded — never
any field.

## Access

The password gate (`netlify/edge-functions/password-gate.js`) sets one cookie,
`nb_demo_access`: an expiry signed with HMAC-SHA256. It contains no identity,
no password and nothing about the visitor, and it expires after 12 hours.

## Retention period

Not applicable to visitor data, because none is retained.

Netlify's own access logs (IP, timestamp, path) exist for the deployment as
they do for any site, under Netlify's retention policy. Nothing in this
repository adds to them.

## If this ever becomes a real service

Every statement above stops being true the moment a form is wired to something
that keeps what it receives. At that point this site needs a PIPEDA-compliant
privacy policy naming the purpose, the processors, where data is held, the
retention period and how to withdraw consent — and the consent notice on each
form needs to go back to asking for consent, which it currently does not,
because there is nothing to consent to.
