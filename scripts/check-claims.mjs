// Refuses to build if the site asserts something that is not true.
//
// Every claim below was corrected once after a content review. Correcting
// strings by hand does not keep them corrected: the same wrong rate, the same
// invented coverage limit and the same non-partner's claims line had each been
// copied into several files, and nothing would have noticed them coming back.
// This runs before the build, the way check-rates and check-routes do.
//
// Rules are deliberately narrow. "Co-op" is not banned -- co-op and
// co-ownership MORTGAGE lending is real and is the best differentiator this
// credit union has; only co-op *insurance* is invented. Precision matters more
// than coverage here: a rule that cries wolf gets deleted.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

const RULES = [
  // --- rates: stale figures, and rates written into components at all -------
  { re: /(?<![\d.])4\.39\s?%/g, why: 'stale 3-year rate; it is 4.59% (3-year closed)' },
  { re: /(?<![\d.])3\.89\s?%/g, why: 'stale 5-year high-ratio rate; it is 3.65% (5-year variable high ratio)' },

  // --- claims lines for companies that are not partners ---------------------
  // Shipping a wrong claims number sends a member mid-claim to a company that
  // has never heard of them. The worst thing this site can do.
  { re: /1-888-476-8737/g, why: "The Personal's claims line; they are not a current partner" },
  { re: /1-800-263-9120/g, why: "CUMIS's claims line; they are not a current partner" },
  { re: /1-800-268-6195/g, why: "Manulife's group line; not a confirmed partner" },

  // --- travel: the real product is Allianz, referral only -------------------
  { re: /annual multi-?trip/gi, why: 'invented travel product; the real one is Allianz Global Assistance (agency code 8528)' },
  { re: /\$5\s?M(?:illion)?\s+medical|up to \$5M/gi, why: 'invented travel medical maximum' },
  { re: /pre-?existing (?:condition|medical)/gi, why: 'invented travel eligibility claim' },

  // --- the mobile app cannot send money abroad ------------------------------
  { re: /send money to estonia|transfers?[^.]{0,40}from the app|in-app (?:international )?transfers?/gi,
    why: 'the real products are internationally sent wires and advance-order euro/USD cash in branch' },

  // --- the entity dates from 2020 -------------------------------------------
  { re: /70\+?\s?years?(?!\s*(?:old|of age))/gi,
    why: 'the entity was formed in 2020; its roots date to 1954 (Estonian CU) and 1959 (Latvian CU)' },

  // --- co-op INSURANCE is invented; co-op MORTGAGE lending is real ----------
  { re: /co-?op(?:erative)?(?:\s+apartment)?\s+insurance/gi,
    why: 'co-op insurance is not a product; the real co-op offering is mortgage lending' },

  // --- estates is administration, not planning ------------------------------
  { re: /estate\s*(?:&|and)\s*succession planning|estate planning/gi,
    why: 'they run an estates function for deceased member accounts -- administration, not planning' },

  // --- referral-only: no quoting, binding or advising -----------------------
  // Third-party insurance lines are referral-only under Ontario's Sale of
  // Insurance regulation. The verbs are "connect you with" and "refer you to".
  { re: /get (?:a |an )?(?:instant |free )?quote|instant quote|quote calculator|get quoted|request a quote/gi,
    why: 'implies quoting; an unlicensed credit union may refer, not quote' },
  { re: /\bbind (?:coverage|a policy)|we (?:advise|recommend) (?:you|that)/gi,
    why: 'implies advising or binding' },

  // --- invented pricing, discounts and track records -------------------------
  // Found after the carriers moved into content/partners.json: the same claims
  // were still in page copy in phrasings the rules above did not cover.
  { re: /\d{1,2}(?:-\d{1,2})?%\s*below market|\d{2}% renewal(?: rate)?/gi,
    why: 'invented discount or track record; no source for it' },
  { re: /(?:from|starting at(?: about)?|approximately) C?\$\d[\d,.]*\s*\/\s*(?:mo|month|year|yr)\b/gi,
    why: 'invented premium; Northern Birch does not quote insurance' },
  { re: /(?:sign|click) (?:now|here) to activate coverage/gi,
    why: 'implies binding coverage' },
];

// Files whose whole job is to catch these strings, or to explain them.
const EXEMPT = [
  'scripts/check-claims.mjs',
  'netlify/functions/prompts.test.mjs',
  'netlify/edge-functions/password-gate.test.mjs',
  'docs/',
];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'dist-ssr' || name === '.git') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx?|mjs)$/.test(name)) files.push(p);
  }
};
for (const dir of ['src', 'netlify', 'scripts']) walk(join(ROOT, dir));

const hits = [];
for (const file of files) {
  const rel = relative(ROOT, file);
  if (EXEMPT.some((e) => rel.startsWith(e))) continue;
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const { re, why } of RULES) {
    for (const m of text.matchAll(re)) {
      const line = text.slice(0, m.index).split('\n').length;
      hits.push({ rel, line, found: m[0].trim(), why, context: (lines[line - 1] || '').trim().slice(0, 90) });
    }
  }
}

// A ratchet, not a gate. 83 of these were found the first time this ran, and
// most are structural rather than a wrong word: the quote engine is a whole
// page, so is estate planning, and co-op insurance is woven through the
// insurance copy. Fixing them all at once would be a rewrite. So the known set
// is frozen in claims-baseline.json and the build fails only on something NEW
// -- the backlog stays visible on every build and can only shrink.
//
// To burn one down: fix the copy, then regenerate with
//   UPDATE_CLAIMS_BASELINE=1 node scripts/check-claims.mjs
const BASELINE = join(ROOT, 'scripts', 'claims-baseline.json');
const key = (h) => `${h.rel} :: ${h.why}`;
const tally = (list) => list.reduce((acc, h) => (acc[key(h)] = (acc[key(h)] || 0) + 1, acc), {});

const now = tally(hits);
if (process.env.UPDATE_CLAIMS_BASELINE) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + '\n');
  console.log(`baseline updated -- ${hits.length} known claims across ${Object.keys(now).length} file/rule pairs`);
  process.exit(0);
}
let known = {};
try { known = JSON.parse(readFileSync(BASELINE, 'utf8')); } catch { /* no baseline yet: everything is new */ }

const regressions = [];
for (const h of hits) if ((now[key(h)] || 0) > (known[key(h)] || 0)) regressions.push(h);
const fixedPairs = Object.keys(known).filter((k) => !(k in now));

if (regressions.length) {
  console.error(`\nThe site asserts ${regressions.length} NEW thing${regressions.length > 1 ? 's' : ''} that is not true:\n`);
  for (const h of regressions) {
    console.error(`  ${h.rel}:${h.line}  "${h.found}"`);
    console.error(`      ${h.why}`);
    console.error(`      ${h.context}\n`);
  }
  console.error('Nothing was built. Fix the copy, or narrow the rule in scripts/check-claims.mjs\n');
  process.exit(1);
}
if (fixedPairs.length) {
  console.log(`claims: ${fixedPairs.length} baseline entr${fixedPairs.length > 1 ? 'ies are' : 'y is'} now clean -- regenerate with UPDATE_CLAIMS_BASELINE=1`);
}
console.log(`claims ok -- ${files.length} files, ${RULES.length} rules, ${hits.length} known claims still to correct (see scripts/claims-baseline.json)`);
process.exit(0);
