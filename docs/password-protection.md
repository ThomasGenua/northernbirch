# Password protection

The whole site is protected by `netlify/edge-functions/password-gate.js` before
Netlify serves any page, asset, function, or form endpoint.

## Configuration

Set `SITE_PASSWORD` in Netlify under **Site configuration → Environment
variables**. For local Netlify development, put it in the ignored `.env` file.
Never prefix it with `VITE_`: Vite variables are compiled into public browser
JavaScript.

The gate fails closed when the variable is absent, so configure the production
environment before deploying. The requested password is present only in the
local ignored `.env`; it is not committed to this repository.

## How access works

An unauthenticated visitor receives a dedicated password form. A correct
password creates a one-week cookie with `HttpOnly`, `SameSite=Lax`, `Path=/`,
and `Secure` on HTTPS, then returns the visitor to the requested page. The
password is not stored in that cookie. Changing `SITE_PASSWORD` invalidates all
existing access cookies automatically.

The edge function applies to `/*`, including prerendered pages, static assets,
`/api/chat`, and form posts. This is intentionally server-side: a React overlay
would leave all prerendered content readable in page source.

## Removing the gate

Delete the edge function and its test, then remove the test command from
`package.json`. While the gate is enabled, crawlers receive a 401 and noindex
headers, so the site will not remain indexed publicly.
