// The whole point of this endpoint is that it keeps nothing, which is exactly
// the kind of property that rots silently: someone adds a console.log to debug
// a submission and the demo starts recording people's phone numbers again.
// These pin the behaviour and the promise.
const { default: handler } = await import("./demo-intake.mjs");

const post = (form, fields = {}, method = "POST") => new Request(
  `https://x/api/demo-intake${form === null ? "" : `?form=${encodeURIComponent(form)}`}`,
  { method, ...(method === "POST" ? { body: new URLSearchParams(fields) } : {}) },
);

let pass = 0, fail = 0;
const check = (name, cond, detail = "") => { cond ? (pass++, console.log("  PASS", name)) : (fail++, console.log("  FAIL", name, detail)); };
const REAL = { name: "Kadri Tamm", email: "kadri@example.com", phone: "416-555-0134", notes: "I earn 92000 and have 40k saved" };

// --- it accepts the site's four forms -------------------------------------
for (const form of ["application", "booking", "claim", "referral"]) {
  const res = await handler(post(form, REAL));
  const body = await res.json();
  check(`${form}: accepted`, res.status === 200 && body.ok === true, `${res.status}`);
  check(`${form}: says plainly that nothing was stored`, body.stored === false && /not saved, sent, or shared/i.test(body.message));
}

// --- and nothing else ------------------------------------------------------
check("an unknown form is refused", (await handler(post("mortgage-payout", REAL))).status === 400);
check("a missing form is refused", (await handler(post(null, REAL))).status === 400);
check("GET is refused", (await handler(post("booking", {}, "GET"))).status === 405);

// --- it never echoes what it was given ------------------------------------
// A response that reflected the submission back would put it in the browser's
// network log, and from there into a screen recording of the demo.
{
  const text = await (await handler(post("application", REAL))).text();
  for (const [field, value] of Object.entries(REAL))
    check(`the response contains no ${field}`, !text.includes(value), text.slice(0, 120));
}

// --- fields that must never be collected ----------------------------------
// check-routes.mjs stops us writing a form that asks for these. This stops a
// hand-crafted POST carrying one anyway.
for (const field of ["sin", "SIN", "socialInsurance", "dateOfBirth", "dob", "password", "accountNumber", "cardNumber", "cvv"]) {
  const res = await handler(post("application", { ...REAL, [field]: "123" }));
  check(`refuses a submission carrying "${field}"`, res.status === 422, `got ${res.status}`);
}

// --- the promise itself ----------------------------------------------------
{
  const source = await (await import("node:fs")).promises.readFile(new URL("./demo-intake.mjs", import.meta.url), "utf8");
  // The body is read only to list its keys. Anything that reaches the values
  // is how "we keep nothing" quietly stops being true.
  check("the source never reads a submitted value", !/\.get\(["'](?!form)/.test(source.replace(/searchParams\.get\("form"\)/g, "")));
  check("the source logs nothing", !/console\.(log|info|warn|error|debug)/.test(source));
  check("the source forwards nothing", !/fetch\(/.test(source));
  check("responses are marked no-store", /Cache-Control["']?\s*:\s*["']no-store/.test(source));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
