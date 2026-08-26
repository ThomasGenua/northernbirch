import { chromium } from 'playwright-core';
import { BASE, ROUTES, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext(); await blockFonts(ctx);
let total=0;
for(const r of ROUTES){
  const page=await ctx.newPage();
  await page.goto(BASE+r,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(2000);                  // let the 0.8s Fade transitions settle
  await page.addScriptTag({url:'/axe.min.js'});
  const res=await page.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}}));
  const v=res.violations;
  total+=v.reduce((n,x)=>n+x.nodes.length,0);
  if(v.length)console.log(`FAIL ${r}: `+v.map(x=>`${x.id}(${x.nodes.length}) [${x.nodes[0].target}] ${x.nodes[0].failureSummary?.split('\n')[1]||''}`).join(' | '));
  else console.log(`ok   ${r}`);
  await page.close();
}
console.log(`\ntotal WCAG 2 A/AA violations: ${total}`);
console.log(`\n${total===0?1:0} passed, ${total===0?0:1} failed`);
await br.close();
