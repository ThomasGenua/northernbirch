// The claims scripts/check-claims.mjs refuses to let the site make, each with
// the reason it is wrong. Kept apart from the checker so docs/COMPLIANCE.md
// can list the same reasons (scripts/generate-compliance.mjs).
export const RULES = [
  // --- rates: stale figures, and rates written into components at all -------
  { re: /(?<![\d.])4\.39\s?%/g, why: 'stale 3-year rate; it is 4.59% (3-year closed)' },
  { re: /(?<![\d.])3\.89\s?%/g, why: 'stale 5-year high-ratio rate; it is 3.65% (5-year variable high ratio)' },
  { re: /\b(?:held|hold|holds|guaranteed?(?: for)?) (?:for )?(?:60|90|120)[- ]days?\b|\b(?:60|90|120)[- ]day (?:rate )?(?:hold|guarantee)\b/gi,
    why: 'wrong rate guarantee; it is a 130-day rate guarantee' },

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
