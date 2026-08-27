import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const ctx=await br.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await blockFonts(ctx);
for(const r of ['/rates','/travel','/business','/digital','/community','/blog','/mobile-app','/personal','/contact','/privacy','/complaints','/dashboard','/leadership','/messages']){
  const page=await ctx.newPage();
  await page.goto(BASE+r,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(1200);
  const o=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  check(o.sw<=o.cw+1,`${r.padEnd(14)} no horizontal overflow (${o.sw} vs ${o.cw})`);
  // every button big enough to hit with a thumb
  const small=await page.locator('main button').evaluateAll(bs=>bs.filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<24}).map(b=>b.textContent.slice(0,30)));
  check(small.length===0,`${r.padEnd(14)} tap targets >=24px${small.length?' SMALL: '+JSON.stringify(small):''}`);
  await page.close();
}
// keyboard: the message transcript is now reachable and scrollable
const p2=await ctx.newPage();
await p2.goto(`${BASE}/messages`,{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(1200);
// on a phone the transcript opens only after picking a thread
if(await p2.locator('[role="log"]').count()===0) await p2.locator('main button').first().click();
await p2.waitForTimeout(600);
const log=p2.locator('[role="log"]');
check(await log.count()===1,'/messages a thread opens on mobile');
await log.focus();
check(await p2.evaluate(()=>document.activeElement?.getAttribute('role')==='log'),'/messages transcript is focusable');
const before=await log.evaluate(e=>e.scrollTop);
await p2.keyboard.press('End'); await p2.waitForTimeout(300);
check(await log.evaluate(e=>e.scrollTop)>=before,'/messages transcript scrolls by keyboard');
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
