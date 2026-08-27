import { chromium } from 'playwright-core';
import { BASE, ROUTES, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900}}); ctx.setDefaultTimeout(6000);
await blockFonts(ctx);
// A name made only of symbols/emoji/punctuation is announced literally
// ("high voltage, button") and tells a screen-reader user nothing.
const BAD=/^[^\p{L}\p{N}]+$/u;
const found=new Map();
for(const r of ROUTES){
  const p=await ctx.newPage();
  await p.goto(BASE+r,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(900);
  const bad=await p.evaluate(()=>{
    const out=[];
    for(const el of document.querySelectorAll('button, a[href], [role="button"]')){
      const al=el.getAttribute('aria-label');
      const name=(al||el.textContent||'').trim();
      out.push({name,tag:el.tagName,labelled:!!al,html:el.outerHTML.slice(0,90)});
    }
    return out;
  });
  for(const b of bad){
    if(!b.name||BAD.test(b.name)){
      const key=b.html;
      if(!found.has(key))found.set(key,{...b,routes:[]});
      found.get(key).routes.push(r);
    }
  }
  await p.close();
}
console.log(`${found.size} control(s) whose whole accessible name is symbols or empty`);
for(const [,v] of found) console.log(`  name=${JSON.stringify(v.name)} labelled=${v.labelled} on ${v.routes.length} route(s) e.g. ${v.routes[0]}\n    ${v.html}\n`);
await br.close();
console.log(`\n${found.size===0?1:0} passed, ${found.size===0?0:1} failed`);
