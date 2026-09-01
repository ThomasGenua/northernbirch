// The rate table moved into src/data/rates.json. These check the seam: what
// the file says is what the site prints, and a bad edit cannot ship.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const FILE = new URL('../../src/data/rates.json', import.meta.url);
const data = JSON.parse(readFileSync(FILE, 'utf8'));

const br = await chromium.launch({ executablePath: EXECUTABLE });
const ctx = await br.newContext({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
ctx.setDefaultTimeout(8000);
await blockFonts(ctx);
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };
const go = async (r) => {
  const p = await ctx.newPage();
  await p.goto(BASE + r, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(1000);
  await p.locator('button', { hasText: 'Essential only' }).click().catch(() => {});
  await p.waitForTimeout(250);
  return p;
};

// every posted row reaches the page verbatim
{
  const p = await go('/rates');
  const txt = await p.locator('main').innerText();
  let missing = [];
  for (const [name, rows] of Object.entries(data.tables))
    for (const [term, rate] of rows)
      if (!txt.includes(term) || !txt.includes(rate)) missing.push(`${name}: ${term} ${rate}`);
  check(missing.length === 0, `all 24 posted rows render${missing.length ? ': ' + JSON.stringify(missing.slice(0, 3)) : ''}`);
  const eff = new Date(`${data.effective}T00:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  check(txt.includes(eff), `the page says when the rates took effect (${eff})`);
  await p.close();
}

// and the named rates the rest of the site quotes agree with it
{
  const p = await go('/');
  const txt = await p.locator('main').innerText();
  check(txt.includes(data.rates.m5), `home page quotes the 5-year fixed from the file (${data.rates.m5})`);
  check(txt.includes(data.rates.gic1), `home page quotes the 1-year GIC from the file (${data.rates.gic1})`);
  check(/Rates effective/.test(txt), 'home page dates its rates too');
  await p.close();
}

// the validator is the thing standing between a typo and a compliance problem
{
  const original = readFileSync(FILE, 'utf8');
  const run = () => { try { execFileSync('node', ['scripts/check-rates.mjs'], { stdio: 'pipe' }); return { ok: true, out: '' }; }
                      catch (e) { return { ok: false, out: String(e.stdout || '') + String(e.stderr || '') }; } };
  try {
    check(run().ok, 'the committed rates.json passes');

    writeFileSync(FILE, original.replace('"gic5": "2.50%"', '"gic5": "3.45%"'));
    let r = run();
    check(!r.ok && /5-Year GIC/.test(r.out), 'a promotion contradicting the posted table fails the build');

    writeFileSync(FILE, original.replace('"m5": "4.34%"', '"m5": "4.34"'));
    r = run();
    check(!r.ok && /does not look like a rate/.test(r.out), 'a malformed rate fails the build');

    writeFileSync(FILE, original.replace(/"effective": "[\d-]+"/, '"effective": "2099-01-01"'));
    r = run();
    check(!r.ok && /in the future/.test(r.out), 'rates dated in the future fail the build');

    writeFileSync(FILE, original.replace(/"effective": "[\d-]+"/, '"effective": "2020-01-01"'));
    r = run();
    check(r.ok, 'but stale rates only warn -- an old date never blocks an unrelated deploy');
  } finally {
    writeFileSync(FILE, original);
  }
  check(readFileSync(FILE, 'utf8') === original, 'rates.json restored after the test');
}

console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
