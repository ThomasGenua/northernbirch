globalThis.Netlify = { env: { get: (key) => ({ SITE_PASSWORD: "s3cret-password" })[key] } };

const { accessToken, sameSecret, default: handler } = await import("./password-gate.js");
const NEXT = { next: async () => new Response("the site", { status: 200 }) };
let passed = 0, failed = 0;
const check = (name, condition) => condition
  ? (passed += 1, console.log("  PASS", name))
  : (failed += 1, console.log("  FAIL", name));

check("constant comparison accepts the password", sameSecret("s3cret-password", "s3cret-password"));
check("constant comparison rejects a prefix", !sameSecret("s3cret", "s3cret-password"));

const denied = await handler(new Request("https://example.test/mortgages"), NEXT);
check("anonymous visitors get the password page", denied.status === 401 && /Access demo/.test(await denied.text()));
check("the password page is not cacheable", denied.headers.get("cache-control") === "no-store");
check("native Basic Auth is no longer requested", !denied.headers.has("www-authenticate"));

const wrong = await handler(new Request("https://example.test/__site-access", {
  method: "POST",
  body: new URLSearchParams({ password: "wrong", returnTo: "/mortgages" }),
}), NEXT);
check("a wrong password is refused", wrong.status === 401 && !wrong.headers.has("set-cookie"));

const login = await handler(new Request("https://example.test/__site-access", {
  method: "POST",
  body: new URLSearchParams({ password: "s3cret-password", returnTo: "/mortgages" }),
}), NEXT);
const cookie = login.headers.get("set-cookie") ?? "";
check("a correct password redirects back", login.status === 303 && login.headers.get("location") === "/mortgages");
check("the access cookie is protected", /HttpOnly/i.test(cookie) && /Secure/i.test(cookie) && /SameSite=Lax/i.test(cookie));

const token = await accessToken("s3cret-password");
const open = await handler(new Request("https://example.test/mortgages", {
  headers: { cookie: `nb_site_access=${token}` },
}), NEXT);
check("a valid access cookie reaches the site", open.status === 200 && await open.text() === "the site");

const configured = globalThis.Netlify;
const realError = console.error;
globalThis.Netlify = { env: { get: () => undefined } };
console.error = () => {};
const shut = await handler(new Request("https://example.test/"), NEXT);
console.error = realError;
globalThis.Netlify = configured;
check("a missing environment secret fails closed", shut.status === 401);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
