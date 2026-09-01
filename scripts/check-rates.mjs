// Posted rates are FSRA-facing: a wrong or missing one is a compliance
// problem, not a display bug. This runs before the build so a bad edit to
// rates.json fails here, loudly, instead of shipping.
import { readFileSync } from 'node:fs';

const FILE = new URL('../src/data/rates.json', import.meta.url);

// Every key the site reads, and the shape its value has to take. Adding a rate
// to the site means adding it here first -- that is the point.
const SHAPE = {
  m3:    /^\d{1,2}\.\d{2}%$/,
  m5:    /^\d{1,2}\.\d{2}%$/,
  m5hr:  /^\d{1,2}\.\d{2}%$/,
  mvar:  /^Prime [-+] \d{1,2}\.\d{2}%$/,
  heloc: /^Prime [-+] \d{1,2}\.\d{2}%$/,
  hisa:  /^\d{1,2}\.\d{2}%$/,
  gic1:  /^\d{1,2}\.\d{2}%$/,
  gic5:  /^\d{1,2}\.\d{2}%$/,
  mc:    /^\d{1,2}\.\d{2}%$/,
  mcLow: /^\d{1,2}\.\d{2}%$/,
  chq:   /^\$\d+(\.\d{2})?$/,
};

// The table on /rates and the named rates quoted elsewhere have to agree. A
// promotion contradicting the posted table is exactly the bug this guards.
const LINKS = {
  mortgage: { '3-Year Fixed': 'm3', '5-Year Fixed': 'm5', '5-Year High Ratio': 'm5hr', 'Variable Rate': 'mvar', HELOC: 'heloc' },
  deposit:  { 'High-Interest Savings': 'hisa', '1-Year GIC': 'gic1', '5-Year GIC': 'gic5' },
  lending:  { 'Collabria Mastercard': 'mc', 'Collabria Low Rate': 'mcLow' },
};

const STALE_DAYS = 90;
const errors = [], warnings = [];

let data;
try { data = JSON.parse(readFileSync(FILE, 'utf8')); }
catch (e) { console.error(`rates.json is not valid JSON: ${e.message}`); process.exit(1); }

const { effective, rates } = data;

if (!/^\d{4}-\d{2}-\d{2}$/.test(effective || '')) {
  errors.push(`"effective" must be a YYYY-MM-DD date, got ${JSON.stringify(effective)}`);
} else {
  const d = new Date(`${effective}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) errors.push(`"effective" is not a real date: ${effective}`);
  else {
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    // A future date would advertise rates that are not in force yet.
    if (days < 0) errors.push(`"effective" is in the future: ${effective}`);
    else if (days > STALE_DAYS) warnings.push(`rates were last reviewed ${days} days ago (${effective}) -- confirm they are still posted`);
  }
}

if (!rates || typeof rates !== 'object') {
  errors.push('"rates" is missing');
} else {
  for (const [key, re] of Object.entries(SHAPE)) {
    const v = rates[key];
    if (v === undefined) errors.push(`rates.${key} is missing`);
    else if (typeof v !== 'string') errors.push(`rates.${key} must be a string, got ${typeof v}`);
    else if (!re.test(v)) errors.push(`rates.${key} = ${JSON.stringify(v)} does not look like a rate (expected ${re})`);
  }
  for (const key of Object.keys(rates)) {
    if (!(key in SHAPE)) warnings.push(`rates.${key} is not read by the site -- remove it or wire it up`);
  }
}

const { tables } = data;
if (!tables || typeof tables !== 'object') {
  errors.push('"tables" is missing');
} else {
  for (const name of Object.keys(LINKS)) {
    if (!Array.isArray(tables[name])) { errors.push(`tables.${name} is missing or not a list`); continue; }
    for (const [i, row] of tables[name].entries()) {
      if (!Array.isArray(row) || row.length !== 2 || row.some(v => typeof v !== 'string' || !v))
        errors.push(`tables.${name}[${i}] must be ["term", "rate"], got ${JSON.stringify(row)}`);
    }
    const seen = new Map(tables[name].filter(r => Array.isArray(r) && r.length === 2));
    for (const [term, key] of Object.entries(LINKS[name])) {
      if (!seen.has(term)) { errors.push(`tables.${name} has no "${term}" row, which rates.${key} is posted as`); continue; }
      if (seen.get(term) !== rates?.[key])
        errors.push(`"${term}" is ${JSON.stringify(seen.get(term))} in the table but rates.${key} is ${JSON.stringify(rates?.[key])} -- the site would advertise both`);
    }
  }
}

for (const w of warnings) console.warn(`rates.json: ${w}`);
if (errors.length) {
  console.error(`\nrates.json has ${errors.length} problem${errors.length > 1 ? 's' : ''}:`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nNothing was built. Fix src/data/rates.json and try again.\n');
  process.exit(1);
}
const rows=Object.values(tables).reduce((n,t)=>n+t.length,0);
console.log(`rates.json ok -- ${Object.keys(rates).length} named rates, ${rows} posted rows, effective ${effective}`);
