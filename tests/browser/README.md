# Browser suites

Regression cover for the behaviour fixed in #14, #15 and #16. Everything here
was written by exercising the built site in a real browser, so each suite
encodes a bug that actually shipped rather than a hypothetical one.

```bash
npm run build          # the suites run against dist/, not the dev server
npm run test:browser   # all suites
npm run test:browser -- search focus    # only suites whose name matches
npm run test:all       # the /api/chat unit tests too
```

Needs a Chromium. The runner looks for one in the usual places; point
`CHROME_PATH` at a binary if it cannot find yours. `PORT` overrides the port
the static server binds (default 3118).

The static server in `server.mjs` mimics Netlify: it serves `dist/<route>/index.html`
for a directory, falls back to `dist/index.html` for anything missing (the SPA
redirect), and applies the real headers out of `netlify.toml` — which is what
makes the CSP suite meaningful.

## What each suite protects

| Suite | The bug it stops coming back |
|---|---|
| `accessibility-wcag` | 17 WCAG 2 A/AA violations across the site, including an unlabelled transfer input and 2.2:1 stat figures |
| `accessible-names` | Buttons whose entire accessible name was an emoji — a screen reader said "magnifying glass, button" |
| `form-labels` | Ten controls with only a placeholder, including a password field with no name at all |
| `overlay-states` | axe only scans the default page state; these open each overlay first |
| `focus` | The search overlay dropped focus onto `<body>` on close, because `autoFocus` runs before the trap's effect |
| `error-boundary` | A single render error unmounted the whole app to a blank page |
| `routes` | Pages with no interactive elements at all, and page errors on any route |
| `cta-navigation` | CTAs that led nowhere |
| `dashboard` | Twenty dashboard buttons with no `onClick` |
| `modules`, `interactions` | Claims wizard, health quiz, estate tabs, glossary, messages, footer |
| `forms` | Forms that fabricated confirmations while sending nothing; consent gating; honeypot; a 500 must not show success |
| `navigation` | Back/forward/deep-link/title through the history router |
| `transfer-validation` | "abc" produced "Recipient Gets €NaN" beside a live Send button |
| `calculators` | US monthly compounding on Canadian mortgages; 0% silently rendering nothing; negative input answered confidently |
| `quote-calculator` | Sliders, product switching, NaN, and money formatting |
| `search` | Enter and the arrow keys did nothing; results ranked by array index |
| `language` | The language choice was discarded on every reload; `<html lang>` never changed |
| `resize`, `rotation` | Layout never reflowed on resize or rotation, and rotating must not cost you a half-filled form |
| `chat-launcher` | The cookie banner covered the chat launcher; on mobile it was entirely buried |
| `mobile` | Horizontal overflow and sub-24px tap targets at 390px |
| `rate-consistency` | A promoted GIC rate that contradicted the posted rate table, and un-interpolated `${...}` reaching members |
| `seo` | 20 routes sharing one title and description; the generator appending duplicate canonical tags |
| `social` | `summary_large_image` declared with no `og:image`; schema asserting branch details the site does not publish |
| `security-headers`, `csp` | Missing HSTS; and that the inline JSON-LD and og-image survive the CSP |
| `dom-ids` | Duplicate ids and `label[for]` pointing at nothing |
| `pdf-export` | Exports must carry the branding, the figure, and say a quote is an estimate rather than an offer |

## Conventions

Suites print `N passed, M failed`; the sweeps (`accessibility-wcag`,
`overlay-states`, `form-labels`, `accessible-names`, `dom-ids`, `routes`) print
a total instead. The runner reads either. A suite that prints neither is
treated as failed, so a crash cannot pass silently.

Reduced motion is on in most contexts: the chat launcher pulses forever, and
Playwright will not click an element it never sees settle.
