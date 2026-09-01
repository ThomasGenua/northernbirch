# Measurement

The site ships measuring **nothing**. No analytics script is loaded, no request
leaves the browser, and the cookie banner says so. Turning it on is one
environment variable.

## Turning it on

1. Create a site at [plausible.io](https://plausible.io) for `northernbirchcu.com`.
2. In Netlify → Site configuration → Environment variables, add:
   `VITE_PLAUSIBLE_DOMAIN = northernbirchcu.com`
3. Redeploy. It is a build-time variable, so a redeploy is required.

To turn it off again, remove the variable and redeploy.

## What is recorded, and what is never recorded

Measurement runs **only** for visitors who choose "Allow measurement" in the
cookie banner. Anyone who chooses "Essential only", or who never answers, is
never measured — the script is not even downloaded.

Recorded:

| Event | Properties |
|---|---|
| `pageview` | the route |
| `product_card` | which banking product was opened from the home page |
| `advice_card` | which advice service was opened |
| `hero_cta` | which of the four hero buttons was pressed |
| `search_result` | which page a search result led to |
| `form_submit` | which form, and whether it succeeded |

Never recorded: names, emails, phone numbers, amounts, form field contents,
search terms, or anything else a member typed. Every property above is a value
this codebase chose, not something a person entered. Plausible sets no cookies
and stores no personal data, which is what makes this defensible under PIPEDA.

**Keep it that way.** If you add an event, the property values must be literals
from the code. `track("search_result", {to: item.page})` is fine;
`track("search", {query})` is not.

## Why Plausible and not Google Analytics

GA4 sets cookies, collects an advertising identifier, and moves personal
information to the United States — all of which a credit union then has to
disclose and defend. Plausible is cookieless and EU-hosted, so the consent
conversation stays simple and the privacy policy stays true.

## The content security policy

`netlify.toml` allows `https://plausible.io` in `script-src` and `connect-src`.
That is inert while no domain is configured; without it, setting the variable
would fail silently because the browser would block the script.
