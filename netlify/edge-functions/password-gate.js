// Server-side password gate for every page, asset, function, and form post.
// The password stays in Netlify's SITE_PASSWORD environment variable and is
// never sent to the browser or compiled into the application bundle.

const COOKIE_NAME = "nb_site_access";
const COOKIE_TTL = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();

export function sameSecret(left, right) {
  const a = encoder.encode(String(left ?? ""));
  const b = encoder.encode(String(right ?? ""));
  let difference = a.length ^ b.length;
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
  }
  return difference === 0;
}

export async function accessToken(password) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`northern-birch-site-access-v1:${password}`),
  );
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function cookieValue(header) {
  for (const part of String(header ?? "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === COOKIE_NAME) {
      return part.slice(separator + 1).trim();
    }
  }
  return "";
}

function safeReturnTo(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function passwordPage(returnTo, invalid = false) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Private access | Northern Birch</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#fdfbf7;color:#1b2a4a;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}main{width:min(100%,420px);background:#fff;border:1px solid #e6e2d9;border-radius:20px;padding:36px;box-shadow:0 18px 55px rgba(27,42,74,.12)}.mark{width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:#1b2a4a;color:#fff;font-weight:800}h1{margin:24px 0 8px;font-size:25px;line-height:1.2}p{margin:0 0 24px;color:#5f6570}.error{padding:10px 12px;border-radius:9px;background:#fff0ef;color:#9f2c23;font-size:14px}label{display:block;margin-bottom:7px;font-size:14px;font-weight:700}input{width:100%;padding:12px 13px;border:1px solid #bcc3ce;border-radius:10px;font:inherit;outline:none}input:focus{border-color:#176b57;box-shadow:0 0 0 3px rgba(23,107,87,.14)}button{width:100%;margin-top:16px;padding:13px;border:0;border-radius:10px;background:#176b57;color:#fff;font:700 16px system-ui;cursor:pointer}button:hover{background:#115545}.note{margin:20px 0 0;text-align:center;font-size:13px;color:#777}</style></head>
<body><main><div class="mark" aria-hidden="true">NB</div><h1>This site is private</h1><p>Enter the access password to continue.</p>${invalid ? '<p class="error" role="alert">That password is incorrect. Please try again.</p>' : ""}<form method="post" action="/__site-access"><input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}"><label for="password">Access password</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus><button type="submit">Access demo</button></form><p class="note">Authorized access only</p></main></body></html>`;
}

function denied(returnTo, invalid = false) {
  return new Response(passwordPage(returnTo, invalid), {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export default async (request, context) => {
  const secret = Netlify.env.get("SITE_PASSWORD");
  if (!secret) {
    console.error("SITE_PASSWORD is not set: denying every request.");
    return denied("/");
  }

  const expected = await accessToken(secret);
  if (sameSecret(cookieValue(request.headers.get("cookie")), expected)) {
    return context.next();
  }

  const url = new URL(request.url);
  if (request.method === "POST" && url.pathname === "/__site-access") {
    const form = await request.formData();
    const submitted = String(form.get("password") ?? "");
    const returnTo = safeReturnTo(form.get("returnTo"));
    if (!sameSecret(submitted, secret)) return denied(returnTo, true);

    const secure = url.protocol === "https:" ? "; Secure" : "";
    return new Response(null, {
      status: 303,
      headers: {
        Location: returnTo,
        "Cache-Control": "no-store",
        "Set-Cookie": `${COOKIE_NAME}=${expected}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${COOKIE_TTL}`,
      },
    });
  }

  return denied(safeReturnTo(`${url.pathname}${url.search}`));
};

export const config = { path: "/*" };
