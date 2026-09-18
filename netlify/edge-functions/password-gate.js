// A real password page in front of the whole site.
//
// This replaces an HTTP Basic Auth version, which was the wrong call: the
// browser's own credential dialog cannot be branded, cannot explain what the
// site is before someone types into it, looks indistinguishable from a
// phishing prompt or a server error to a non-technical visitor, and leaves a
// bare error page if they press Cancel. The first thing a prospective client
// sees should say who made this and what it is.
//
// It still runs at the edge rather than in the page. Every route is
// prerendered to static HTML, so the whole site is in the markup before any
// JavaScript runs -- a password check inside the page could only hide that
// behind a div, one "view source" away. This runs before Netlify serves the
// file, so a visitor who has not unlocked never receives the content.
//
// The password is read from SITE_PASSWORD (Netlify UI -> Site configuration ->
// Environment variables) and deliberately NOT written down here: this
// repository is public. With the variable unset the gate denies everyone
// rather than publishing the site, so set it before deploying.

const COOKIE = "nb_demo_access";
const UNLOCK_PATH = "/__unlock";
const MAX_AGE = 60 * 60 * 12;            // a working day, then ask again

// === crypto ================================================================

// Comparing with === leaks how much of the input was right through how long it
// took. This always looks at every byte.
export function sameSecret(a, b) {
  const enc = new TextEncoder();
  const A = enc.encode(String(a ?? "")), B = enc.encode(String(b ?? ""));
  let diff = A.length ^ B.length;
  for (let i = 0; i < Math.max(A.length, B.length); i++) diff |= (A[i] ?? 0) ^ (B[i] ?? 0);
  return diff === 0;
}

// The cookie is signed with the password itself, so it cannot be forged by
// someone who does not already know it, and it carries its own expiry.
export async function sign(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function issue(secret, now = Date.now()) {
  const expires = now + MAX_AGE * 1000;
  return `${expires}.${await sign(String(expires), secret)}`;
}

export async function valid(token, secret, now = Date.now()) {
  if (!secret || !token) return false;
  const dot = String(token).lastIndexOf(".");
  if (dot < 1) return false;
  const expires = token.slice(0, dot), mac = token.slice(dot + 1);
  if (!/^\d+$/.test(expires) || Number(expires) < now) return false;
  return sameSecret(mac, await sign(expires, secret));
}

export function readCookie(header, name) {
  for (const part of String(header ?? "").split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

// Where to send someone after they unlock. Anything that is not a plain
// same-site path becomes "/" -- otherwise the form is an open redirect, and a
// link like /__unlock?next=https://evil.example would bounce them off-site
// wearing this site's trust.
export function safeNext(value) {
  const v = String(value ?? "");
  if (!v.startsWith("/") || v.startsWith("//") || v.includes("\\")) return "/";
  return v;
}

// === the page ==============================================================

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function unlockPage({ next = "/", error = false, configured = true } = {}) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Demo access | Northern Birch Credit Union concept by Oodler</title>
<style>
  :root{--navy:#1B2A4A;--cream:#FDFBF7;--birch:#C8B88A;--accent:#1F6FA5;--amber:#D4A547;--err:#B3271A}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:var(--cream);padding:24px;
       font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--navy)}
  main{width:100%;max-width:33rem}
  .card{background:#fff;border:1px solid #ece6d9;border-radius:20px;padding:40px 36px;
        box-shadow:0 1px 3px rgba(27,42,74,.06)}
  .mark{display:flex;align-items:center;gap:10px;margin-bottom:26px}
  .mark span:first-child{width:34px;height:34px;border-radius:9px;background:var(--navy);color:#fff;
        display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;letter-spacing:.02em}
  .mark span:last-child{font-weight:700;font-size:15px;letter-spacing:.01em}
  .notice{background:#FFF8E6;border:1px solid var(--amber);border-radius:12px;
          padding:14px 16px;margin-bottom:26px;font-size:13.5px;line-height:1.65;color:#5A4410}
  h1{font-size:1.35rem;margin:0 0 .5rem;line-height:1.3}
  .lede{margin:0 0 24px;color:#5c6470;line-height:1.7;font-size:.95rem}
  label{display:block;font-size:.8rem;font-weight:600;margin-bottom:7px;letter-spacing:.02em}
  input{width:100%;padding:13px 15px;font-size:1rem;border:1px solid #d8d3c6;border-radius:11px;
        background:#fff;color:var(--navy);font-family:inherit}
  input:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:transparent}
  button{width:100%;margin-top:16px;padding:13px 18px;font-size:.95rem;font-weight:700;
         border:0;border-radius:11px;background:var(--navy);color:#fff;cursor:pointer;font-family:inherit}
  button:hover{background:#26395f}
  .err{margin:14px 0 0;color:var(--err);font-size:.87rem;font-weight:600}
  .foot{margin:22px 4px 0;font-size:.78rem;color:#7a818c;line-height:1.65}
  @media (prefers-color-scheme: dark){
    body{background:#141b28;color:#eef1f5}
    .card{background:#1c2434;border-color:#2b3548;box-shadow:none}
    .lede{color:#aab3c0}.foot{color:#8d96a5}
    input{background:#141b28;border-color:#39435a;color:#eef1f5}
    button{background:var(--birch);color:#1B2A4A}
    .notice{background:rgba(212,165,71,.12);color:#E8C46A}
  }
</style></head>
<body><main>
  <div class="card">
    <div class="mark"><span>NB</span><span>Northern Birch Credit Union</span></div>

    <div class="notice">
      <strong>This is a demonstration, not a real bank website.</strong><br>
      An illustrative concept prepared by Oodler Inc. It is not operated by,
      endorsed by, or affiliated with Northern Birch Credit Union. Nothing
      inside is an offer, a quote, or advice, and no product shown can be
      bought here.
    </div>

    <h1>Enter the password to view the demo</h1>
    <p class="lede">This preview is shared privately while it is under review.</p>

    ${configured ? `<form method="POST" action="${UNLOCK_PATH}">
      <input type="hidden" name="next" value="${esc(next)}">
      <label for="pw">Password</label>
      <input id="pw" name="password" type="password" autocomplete="current-password"
             autofocus required ${error ? 'aria-describedby="err" aria-invalid="true"' : ""}>
      ${error ? '<p class="err" id="err" role="alert">That password is not correct. Please try again.</p>' : ""}
      <button type="submit">View the demo</button>
    </form>` : `<p class="err" role="alert">This demo is not available right now. Please contact whoever shared the link.</p>`}

    <p class="foot">If you were not given a password, contact Thomas Genua at Oodler Inc.
      For anything concerning your actual accounts, contact Northern Birch Credit Union directly.</p>
  </div>
</main></body></html>`;
}

const HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

// === the gate ==============================================================

export default async (request, context) => {
  const secret = Netlify.env.get("SITE_PASSWORD");
  const url = new URL(request.url);

  // Goes to the Netlify function log, where the site's owner sees it, and
  // never to the visitor: the page below looks the same either way, so a
  // misconfiguration is not advertised to whoever is knocking.
  if (!secret) {
    console.error("SITE_PASSWORD is not set: denying every request. Set it in Site configuration -> Environment variables.");
    return new Response(unlockPage({ configured: false }), { status: 503, headers: HEADERS });
  }

  // Already unlocked.
  if (await valid(readCookie(request.headers.get("cookie"), COOKIE), secret)) return context.next();

  // Someone submitting the form.
  if (url.pathname === UNLOCK_PATH && request.method === "POST") {
    let supplied = "", next = "/";
    try {
      const form = await request.formData();
      supplied = String(form.get("password") ?? "");
      next = safeNext(form.get("next"));
    } catch {
      // malformed body -- treat as a failed attempt
    }
    if (sameSecret(supplied, secret)) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: next,
          "Set-Cookie": `${COOKIE}=${await issue(secret)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
          "Cache-Control": "no-store",
        },
      });
    }
    return new Response(unlockPage({ next, error: true }), { status: 401, headers: HEADERS });
  }

  // Everything else: ask. 200 rather than 401 so browsers render the page
  // normally instead of layering their own credential dialog over it.
  return new Response(unlockPage({ next: url.pathname + url.search }), { status: 200, headers: HEADERS });
};

// Everything: pages, assets, /api/chat and form posts alike. Anything left out
// would be served to whoever guessed its URL.
export const config = { path: "/*" };
