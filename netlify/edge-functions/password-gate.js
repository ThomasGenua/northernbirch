// One shared password in front of the whole site.
//
// This has to run on the server, not in the page. Since #19 every route is
// prerendered to static HTML, so the entire site -- rates, branch addresses,
// the lot -- is sitting in the markup before any JavaScript runs. A
// client-side gate would hide it behind a div and leave it one "view source"
// away. An edge function runs before Netlify serves the file at all, so an
// unauthenticated visitor never receives the bytes.
//
// Netlify has built-in password protection that does the same job from the
// UI, but it is a paid-plan feature; this works on any plan.

// The secret is read from the SITE_PASSWORD environment variable, set in the
// Netlify UI (Site configuration -> Environment variables). It is deliberately
// NOT written down here: this repository is public, so a literal in the source
// would be readable by exactly the people the gate exists to keep out, and
// would live in the git history after any later change.
//
// If the variable is missing the gate denies everyone rather than opening the
// site -- a misconfiguration should fail shut, not publish the thing it was
// meant to protect. Set the variable before deploying this.

const REALM = "Northern Birch Credit Union";

// Comparing with === leaks how much of the password was right through how long
// the comparison took. This always looks at every byte.
function sameSecret(a, b) {
  const enc = new TextEncoder();
  const A = enc.encode(a), B = enc.encode(b);
  let diff = A.length ^ B.length;
  for (let i = 0; i < Math.max(A.length, B.length); i++) diff |= (A[i] ?? 0) ^ (B[i] ?? 0);
  return diff === 0;
}

// Exported so it can be tested without a Netlify runtime. Basic auth sends
// "user:password"; the username is ignored, so a visitor only needs the one
// password and can leave the name box blank.
export function authorized(header, password) {
  if (!password) return false;
  const [scheme, encoded] = String(header ?? "").split(" ");
  if (!/^Basic$/i.test(scheme ?? "") || !encoded) return false;
  let raw;
  try {
    raw = atob(encoded);               // one character per byte
  } catch {
    return false;                      // not valid base64
  }
  // The realm below asks for UTF-8, which is what current browsers send. Older
  // ones send latin-1, and decoding those bytes as UTF-8 would quietly produce
  // replacement characters and refuse a correct password, so fall back to the
  // raw bytes when they are not valid UTF-8. Moot for an ASCII password;
  // free insurance if it is ever changed to one with an accent in it.
  let decoded;
  try {
    decoded = new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(raw, (c) => c.charCodeAt(0)));
  } catch {
    decoded = raw;
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return false;
  return sameSecret(decoded.slice(sep + 1), password);
}

const DENIED = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Password required | Northern Birch Credit Union</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FDFBF7;
font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#1B2A4A;padding:24px}
main{max-width:30rem;text-align:center}h1{font-size:1.4rem;margin:0 0 .6rem}
p{margin:0;color:#555;line-height:1.7;font-size:.95rem}</style></head>
<body><main><h1>This site is password protected</h1>
<p>Reload the page and enter the password when your browser asks. You can leave
the username blank. If you don't have it, contact whoever sent you the link.</p>
</main></body></html>`;

export default async (request, context) => {
  const secret = Netlify.env.get("SITE_PASSWORD");
  // Goes to the Netlify function log, where the site's owner will see it, and
  // never to the visitor -- the 401 below looks the same either way, so a
  // misconfiguration is not advertised to whoever is knocking.
  if (!secret) console.error("SITE_PASSWORD is not set: denying every request. Set it in Site configuration -> Environment variables.");
  if (authorized(request.headers.get("authorization"), secret)) return context.next();

  return new Response(DENIED, {
    status: 401,
    headers: {
      // charset tells the browser to send the password as UTF-8 rather than
      // latin-1, which is what the TextDecoder above expects.
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Content-Type": "text/html; charset=utf-8",
      // Never let a 401 -- or a proxy -- cache in place of the real page.
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
};

// Everything: pages, assets, /api/chat and form posts alike. Anything left out
// would be served to anyone who guessed its URL.
export const config = { path: "/*" };
