// The gate is the only thing standing between the public and the whole site,
// and it cannot be exercised by the browser suites: those run against a local
// static server, and this runs on Netlify's edge. So test it directly.
globalThis.Netlify = { env: { get: (k) => ({ SITE_PASSWORD: "s3cret" }[k]) } };

const { authorized, default: handler } = await import("./password-gate.js");

// UTF-8 then base64, which is what a browser sends when the realm declares
// charset="UTF-8". btoa alone would encode latin-1 and misrepresent the client.
const basic = (user, pass) => "Basic " + btoa(String.fromCharCode(...new TextEncoder().encode(`${user}:${pass}`)));
const basicLatin1 = (user, pass) => "Basic " + btoa(`${user}:${pass}`);
const req = (header) => new Request("https://x/", { headers: header ? { authorization: header } : {} });
const NEXT = { next: async () => new Response("the site", { status: 200 }) };

let pass = 0, fail = 0;
const check = (name, cond, detail = "") => { cond ? (pass++, console.log("  PASS", name)) : (fail++, console.log("  FAIL", name, detail)); };

// --- what gets in ---
check("correct password", authorized(basic("anyone", "s3cret"), "s3cret"));
check("username is ignored", authorized(basic("", "s3cret"), "s3cret"));
check("a non-ASCII password sent as latin-1 by an older browser", authorized(basicLatin1("u", "pässwörd"), "pässwörd"));
check("a password containing a colon", authorized(basic("u", "a:b:c"), "a:b:c"));
check("a non-ASCII password survives the round trip", authorized(basic("u", "pä§§wörd"), "pä§§wörd"));

// --- what does not ---
check("wrong password", !authorized(basic("u", "nope"), "s3cret"));
check("empty password", !authorized(basic("u", ""), "s3cret"));
check("password as a prefix of the real one", !authorized(basic("u", "s3cre"), "s3cret"));
check("password with the real one as a prefix", !authorized(basic("u", "s3cret!"), "s3cret"));
check("no header at all", !authorized(undefined, "s3cret"));
check("empty header", !authorized("", "s3cret"));
check("Bearer token instead of Basic", !authorized("Bearer s3cret", "s3cret"));
check("Basic with nothing after it", !authorized("Basic", "s3cret"));
check("malformed base64", !authorized("Basic !!!!not-base64!!!!", "s3cret"));
check("base64 with no colon separator", !authorized("Basic " + btoa("s3cret"), "s3cret"));
check("the password sent as the username", !authorized(basic("s3cret", ""), "s3cret"));
// RFC 7617: the first colon separates, so a username containing one makes the
// rest -- colon and all -- the password. Standard behaviour, worth pinning.
check("a colon in the username shifts the split, as the RFC says", !authorized(basic("a:b", "s3cret"), "s3cret"));
check("and that request's password is everything after the first colon", authorized(basic("a:b", "s3cret"), "b:s3cret"));
// If SITE_PASSWORD were ever empty, an empty submitted password must not open
// the door -- that would turn a misconfiguration into an open site.
check("no password configured denies everyone", !authorized(basic("u", ""), ""));
check("no password configured denies a guess", !authorized(basic("u", "anything"), undefined));

// --- the response the visitor actually gets ---
{
  const res = await handler(req(), NEXT);
  check("unauthenticated gets 401", res.status === 401, `got ${res.status}`);
  const h = res.headers.get("www-authenticate") || "";
  check("401 asks the browser for a password", /^Basic realm=/.test(h), h);
  check("401 asks for UTF-8, matching how it decodes", /charset="UTF-8"/i.test(h), h);
  check("401 is not cacheable", res.headers.get("cache-control") === "no-store");
  check("401 tells crawlers to stay out", /noindex/.test(res.headers.get("x-robots-tag") || ""));
  const body = await res.text();
  check("401 explains itself rather than showing a blank page", /password protected/i.test(body));
  check("401 leaks none of the site", !/Northern Birch Credit Union<\/h1>|mortgage/i.test(body));
}
{
  const res = await handler(req(basic("u", "s3cret")), NEXT);
  check("correct password is passed through to the site", res.status === 200 && (await res.text()) === "the site");
}
{
  const res = await handler(req(basic("u", "wrong")), NEXT);
  check("wrong password does not reach the site", res.status === 401);
}
// A missing SITE_PASSWORD must lock the site, not open it. This is the whole
// reason the secret is not hardcoded: there is no fallback to fall back to.
{
  const saved = globalThis.Netlify;
  const errors = [];
  const realError = console.error;
  console.error = (m) => errors.push(String(m));
  globalThis.Netlify = { env: { get: () => undefined } };
  try {
    const open = await handler(req(), NEXT);
    check("unconfigured: an anonymous visitor is denied", open.status === 401, `got ${open.status}`);
    const guess = await handler(req(basic("u", "anything")), NEXT);
    check("unconfigured: no password opens it either", guess.status === 401, `got ${guess.status}`);
    const blank = await handler(req(basic("", "")), NEXT);
    check("unconfigured: an empty password does not match an empty secret", blank.status === 401, `got ${blank.status}`);
    check("unconfigured: says so in the server log", errors.some((e) => /SITE_PASSWORD is not set/.test(e)));
    check("unconfigured: but not to the visitor", !/SITE_PASSWORD/.test(await open.text()));
  } finally {
    console.error = realError;
    globalThis.Netlify = saved;
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
