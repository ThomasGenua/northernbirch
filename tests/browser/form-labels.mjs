import { chromium } from 'playwright-core';
import { BASE, ROUTES, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
await blockFonts(ctx);
let n=0;
for(const r of ROUTES){
  const p=await ctx.newPage();
  await p.goto(BASE+r,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(900);
  const bad=await p.evaluate(()=>[...document.querySelectorAll('main input, main select, main textarea')]
    .filter(el=>el.offsetParent!==null)
    .filter(el=>!el.closest('label') && !(el.id&&document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
    .map(el=>({type:el.type,ph:el.placeholder||'',html:el.outerHTML.slice(0,70)})));
  if(bad.length){ n+=bad.length; console.log(`${r}: ${bad.length}`); for(const b of bad) console.log(`   ${b.type.padEnd(9)} placeholder=${JSON.stringify(b.ph)}`); }
  await p.close();
}
console.log(`\nform controls with no label (placeholder only): ${n}`);
await br.close();
console.log(`\n${n===0?1:0} passed, ${n===0?0:1} failed`);
