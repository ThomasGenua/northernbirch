import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900}}); ctx.setDefaultTimeout(6000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,120)));
await p.goto(`${BASE}/quote`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);
// What the member told us, read back -- not a price. See the note below.
const summary=async()=>(await p.locator('#quote-result-panel').innerText()).replace(/\s+/g,' ').trim();
// switching product type must change the form and the summary
const seen=new Set();
for(const type of ['Term Life','Home','Auto','Travel']){
  await p.locator('main button',{hasText:type}).first().click(); await p.waitForTimeout(600);
  const txt=await p.locator('main').innerText();
  check(!/NaN|undefined/.test(txt),`${type}: no NaN in the quote`);
  const sliders=await p.locator('main input[type=range]').count();
  check(sliders>0,`${type}: has ${sliders} slider(s)`);
  seen.add(txt.slice(0,400));
}
check(seen.size===4,`all four product types render a distinct form (${seen.size}/4)`);
// every slider is labelled and moving one changes the summary
await p.locator('main button',{hasText:'Term Life'}).first().click(); await p.waitForTimeout(500);
const unlabelled=await p.locator('main input[type=range]:not([aria-label]):not([id])').count();
check(unlabelled===0,`every slider has a label (${unlabelled} unlabelled)`);
const before=await summary();
const s0=p.locator('main input[type=range]').first();
await s0.focus();
for(let i=0;i<10;i++) await p.keyboard.press('ArrowRight');
await p.waitForTimeout(500);
const after=await summary();
// The page no longer computes a premium: it used to invent one from arbitrary
// multipliers and present it as "your estimated premium", which is quoting.
// What a slider must still do is change the recap of what the member asked for.
check(before!==after,`dragging a slider updates the summary (${before} -> ${after})`);
// The panel still echoes the member's own inputs back ("C$500K coverage"),
// which is not a price. What must be gone is a premium: the label, the big
// computed figure, and the annualised total beside it.
{
  const panel = await p.locator('#quote-result-panel').innerText();
  check(!/Estimated Monthly Premium|premium/i.test(panel), 'the panel names no premium');
  check(!/\/\s?year|per year|\/mo\b|per month/i.test(panel), 'and quotes no price per period');
  check(/does not quote/i.test(panel), 'it says plainly that Northern Birch does not quote');
}
check(!/NaN/.test(after),'the summary never becomes NaN');
// extremes
for(const key of ['Home','End']){
  for(let i=0;i<await p.locator('main input[type=range]').count();i++){
    await p.locator('main input[type=range]').nth(i).focus();
    await p.keyboard.press(key);
  }
  await p.waitForTimeout(500);
  const t=await summary();
  check(t.length>0&&!/NaN|Infinity|undefined/.test(t),`slider ${key} extreme still renders a sane summary (${t.slice(0,60)})`);
}
check(errs.length===0,`no page errors${errs.length?': '+errs[0]:''}`);
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
