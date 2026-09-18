// Where the demo's forms post. It deliberately keeps nothing.
//
// The four forms on this site -- application, booking, claim, referral -- ask
// for a name, an email, a phone number and free text. They used to post to
// Netlify Forms, which stores every submission. On a site that wears a real
// credit union's branding, behind a password people are given precisely
// because we want them to look at it as though it were real, that meant a
// visitor could hand over their phone number and, in a mortgage application's
// notes field, their financial circumstances -- to a demonstration.
//
// So this validates the shape of a submission, tells the caller it was
// received, and discards it. Nothing is written, nothing is forwarded, nothing
// is logged. The flow still demonstrates end to end; the data does not exist a
// millisecond after this returns.
//
// The hidden <form> declarations were removed from index.html at the same
// time. Netlify registers forms by parsing the deployed HTML, so with none
// declared there is no form store for anything -- including a direct POST to
// "/" -- to land in.

const FORMS = new Set(["application", "booking", "claim", "referral"]);

// Fields no form on this site may ever ask for, checked here as well as in
// scripts/check-routes.mjs: the build-time check stops us writing one, this
// stops a hand-crafted POST carrying one anyway.
const NEVER = ["sin", "socialinsurance", "sin_number", "dateofbirth", "dob",
  "password", "accountnumber", "cardnumber", "cvv", "transitnumber"];

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

export default async (request) => {
  if (request.method !== "POST") return json(405, { ok: false, error: "POST only" });

  let fields;
  try {
    const body = await request.formData();
    fields = [...body.keys()];
  } catch {
    return json(400, { ok: false, error: "expected a form submission" });
  }

  // Only the field NAMES are read. The values are never touched -- not to
  // validate them, not to measure them, and certainly not to log them.
  const form = new URL(request.url).searchParams.get("form") || "";
  if (!FORMS.has(form)) return json(400, { ok: false, error: "unknown form" });

  const forbidden = fields.filter((f) => NEVER.includes(f.toLowerCase().replace(/[^a-z]/g, "")));
  if (forbidden.length) return json(422, { ok: false, error: `this site never collects: ${forbidden.join(", ")}` });

  return json(200, {
    ok: true,
    stored: false,
    form,
    message: "This is a demonstration. Your details were not saved, sent, or shared with anyone.",
  });
};

export const config = { path: "/api/demo-intake" };
