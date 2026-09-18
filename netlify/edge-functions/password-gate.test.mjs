// The gate is the only thing between the public and a site that wears a real
// credit union's name, and the browser suites cannot reach it: they run
// against a local static server, this runs on Netlify's edge. So test it here.
globalThis.Netlify = { env: { get: (k) => ({ SITE_PASSWORD: "s3cret" }[k]) } };

const gate = await import("./password-gate.js");
const { default: handler, sameSecret, sign, issue, valid, readCookie, safeNext, unlockPage } = gate;

const NEXT = { next: async () => new Response("the site", { status: 200 }) };
const get = (path = "/", cookie) => new Request("https://x" + path, { headers: cookie ? { cookie } : {} });
const post = (password, next = "/", cookie) => new Request("https://x/__unlock", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded", ...(cookie ? { cookie } : {}) },
  body: new URLSearchParams({ password, next }).toString(),
});
const cookieFrom = (res) => (res.headers.get("set-cookie") || "").split(";")[0];

let pass = 0, fail = 0;
const check = (name, cond, detail = "") => { cond ? (pass++, console.log("  PASS", name)) : (fail++, console.log("  FAIL", name, detail)); };

// --- it is a page, not a browser credential dialog -------------------------
{
  const res = await handler(get("/mortgages"), NEXT);
  const body = await res.text();
  check("an unauthenticated visitor gets a page, not a 401 dialog", res.status === 200, `got ${res.status}`);
  check("and no WWW-Authenticate header, which is what summons the popup", !res.headers.get("www-authenticate"));
  check("it is HTML", (res.headers.get("content-type") || "").includes("text/html"));
  check("with a password form", /<form[^>]+method="POST"[^>]+action="\/__unlock"/i.test(body));
  check("and a password field", /<input[^>]+type="password"/i.test(body));
  check("it remembers where they were going", /name="next" value="\/mortgages"/.test(body));
  check("it is not cacheable", res.headers.get("cache-control") === "no-store");
  check("crawlers are told to stay out", /noindex/.test(res.headers.get("x-robots-tag") || ""));
  check("none of the site leaks through it", !/mortgage rate|4\.59|Chequing/i.test(body));
}

// --- it says, up front, that this is a demo --------------------------------
{
  const body = await (await handler(get("/"), NEXT)).text();
  check("says it is a demonstration, not a real bank website", /demonstration, not a real bank website/i.test(body));
  check("names Oodler as the author", /Oodler/.test(body));
  check("says it is not affiliated with Northern Birch", /not operated by,\s*endorsed by, or affiliated with/i.test(body));
  check("says nothing in it can be bought", /no product shown can be\s*bought here/i.test(body));
}

// --- unlocking -------------------------------------------------------------
{
  const res = await handler(post("s3cret", "/rates"), NEXT);
  check("the right password redirects", res.status === 303, `got ${res.status}`);
  check("back to where they were going", res.headers.get("location") === "/rates");
  const c = res.headers.get("set-cookie") || "";
  check("and sets a cookie", /^nb_demo_access=/.test(c));
  check("the cookie is HttpOnly", /HttpOnly/i.test(c));
  check("the cookie is Secure", /Secure/i.test(c));
  check("the cookie is SameSite=Lax", /SameSite=Lax/i.test(c));

  const through = await handler(get("/rates", cookieFrom(res)), NEXT);
  check("and that cookie gets them in", through.status === 200 && (await through.text()) === "the site");
}
{
  const res = await handler(post("wrong"), NEXT);
  check("the wrong password does not get in", res.status === 401, `got ${res.status}`);
  check("does not set a cookie", !res.headers.get("set-cookie"));
  check("and says so on the page", /not correct/i.test(await res.text()));
}
{
  const res = await handler(post(""), NEXT);
  check("an empty password does not get in", res.status === 401 && !res.headers.get("set-cookie"));
}

// --- forged and stale cookies ----------------------------------------------
{
  check("a made-up cookie does not get in", (await handler(get("/", "nb_demo_access=letmein"), NEXT)).status === 200);
  const future = Date.now() + 9e8;
  check("a cookie signed with the wrong secret is rejected", !(await valid(`${future}.${await sign(String(future), "guess")}`, "s3cret")));
  check("a correctly signed cookie is accepted", await valid(`${future}.${await sign(String(future), "s3cret")}`, "s3cret"));
  check("an expired cookie is rejected", !(await valid(await issue("s3cret", Date.now() - 9e8), "s3cret")));
  check("the expiry cannot be edited without breaking the signature",
    !(await valid((await issue("s3cret")).replace(/^\d+/, String(Date.now() + 9e9)), "s3cret")));
  check("a cookie with no signature is rejected", !(await valid(String(Date.now() + 9e8), "s3cret")));
  check("a cookie with no expiry is rejected", !(await valid(".abc", "s3cret")));
}

// --- the redirect cannot be pointed off-site -------------------------------
for (const [label, value] of [
  ["an absolute URL", "https://evil.example/phish"],
  ["a protocol-relative URL", "//evil.example"],
  ["a backslash trick", "/\\evil.example"],
  ["a scheme", "javascript:alert(1)"],
  ["nothing", ""],
]) check(`next= ${label} falls back to /`, safeNext(value) === "/", safeNext(value));
check("a normal path is kept", safeNext("/rates?x=1") === "/rates?x=1");
{
  const res = await handler(post("s3cret", "https://evil.example"), NEXT);
  check("and the form honours that", res.headers.get("location") === "/");
}

// --- the page cannot be used to inject markup ------------------------------
{
  const body = unlockPage({ next: '/"><script>alert(1)</script>' });
  check("next= is escaped into the form", !/<script>alert\(1\)<\/script>/.test(body));
}

// --- helpers ---------------------------------------------------------------
check("readCookie finds its cookie among others", readCookie("a=1; nb_demo_access=xyz; b=2", "nb_demo_access") === "xyz");
check("readCookie is not fooled by a name that ends the same", readCookie("xnb_demo_access=no", "nb_demo_access") === null);
check("sameSecret rejects a prefix", !sameSecret("s3cre", "s3cret"));
check("sameSecret rejects a longer string", !sameSecret("s3cret!", "s3cret"));
check("sameSecret accepts a match", sameSecret("s3cret", "s3cret"));

// --- unconfigured fails shut, not open -------------------------------------
{
  const saved = globalThis.Netlify;
  const errors = []; const realError = console.error;
  console.error = (m) => errors.push(String(m));
  globalThis.Netlify = { env: { get: () => undefined } };
  try {
    const res = await handler(get("/"), NEXT);
    check("unconfigured: nobody gets in", res.status === 503, `got ${res.status}`);
    const body = await res.text();
    check("unconfigured: no form is offered", !/<input[^>]+type="password"/i.test(body));
    check("unconfigured: still says it is a demo", /demonstration, not a real bank website/i.test(body));
    check("unconfigured: guessing does not help", (await handler(post("anything"), NEXT)).status === 503);
    check("unconfigured: says why in the server log", errors.some((e) => /SITE_PASSWORD is not set/.test(e)));
    check("unconfigured: but not to the visitor", !/SITE_PASSWORD/.test(body));
  } finally { console.error = realError; globalThis.Netlify = saved; }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
