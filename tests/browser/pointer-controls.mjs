// Anything that looks clickable must be a real control.
//
// The audit that added this found a "View All Details" span on the dashboard
// styled with cursor:pointer and wired to nothing: a member clicks, nothing
// happens, and a keyboard or screen-reader user cannot reach it at all. This
// walks every route and fails on any element that shows a pointer cursor
// without being (or sitting inside) a button, link, or an element with a
// button-like role.
import { chromium } from 'playwright-core';
import { BASE, ROUTES, EXECUTABLE, blockFonts } from './env.mjs';

const br = await chromium.launch({ executablePath: EXECUTABLE });
const ctx = await br.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
ctx.setDefaultTimeout(6000);
await blockFonts(ctx);
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

for (const r of ROUTES) {
  const p = await ctx.newPage();
  await p.goto(BASE + r, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(900);
  const fakes = await p.evaluate(() => {
    const real = 'button, a[href], [role="button"], [role="tab"], [role="link"], [role="menuitem"], [role="option"], summary, label, input, select, textarea';
    const out = [];
    for (const e of document.querySelectorAll('body *')) {
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (getComputedStyle(e).cursor !== 'pointer') continue;
      if (e.closest(real)) continue;
      // only the topmost pointer element; its children inherit the cursor
      if (e.parentElement && getComputedStyle(e.parentElement).cursor === 'pointer' && !e.parentElement.closest(real)) continue;
      out.push((e.innerText || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 50));
    }
    return out;
  });
  check(fakes.length === 0, `${r}: nothing shows a pointer without being a control${fakes.length ? ' -- ' + JSON.stringify(fakes) : ''}`);
  await p.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
