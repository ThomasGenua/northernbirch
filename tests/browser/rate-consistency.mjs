import { chromium } from 'playwright-core';
import { BASE, ROUTES, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'}); ctx.setDefaultTimeout(7000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const go=async(r)=>{const p=await ctx.newPage();await p.goto(BASE+r,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1000);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});await p.waitForTimeout(250);return p};
// nothing anywhere should still print an un-interpolated ${...}
let raw=[];
for(const r of ROUTES){
  const p=await go(r);
  const t=await p.locator('body').innerText();
  if(t.includes('${')) raw.push(r+': '+(t.match(/\$\{[^}]*\}/)||[])[0]);
  await p.close();
}
check(raw.length===0,`no un-interpolated template placeholders on any page${raw.length?': '+JSON.stringify(raw):''}`);
// the GIC notification must agree with the posted table
{
  const p=await go('/rates');
  const rates=await p.locator('main').innerText();
  const m5=rates.match(/5-Year GIC\s*\n?\s*([\d.]+%)/); const g1=rates.match(/1-Year GIC\s*\n?\s*([\d.]+%)/);
  check(!!m5&&!!g1,`rates page publishes 5-year=${m5?.[1]} 1-year=${g1?.[1]}`);
  await p.locator('button[aria-label="Notifications"]:visible').first().click(); await p.waitForTimeout(600);
  const n=await p.locator('[role="dialog"]').innerText();
  check(!/3\.45%|3\.20%/.test(n),'notification no longer advertises a rate the table contradicts');
  check(n.includes(m5[1])&&n.includes(g1[1]),`notification quotes the posted rates (${m5[1]}, ${g1[1]})`);
  await p.close();
}
// the advisor transcript must quote the same numbers
{
  const p=await go('/messages');
  const threads=p.locator('main button');
  let found=false;
  for(let i=0;i<await threads.count();i++){
    await threads.nth(i).click(); await p.waitForTimeout(500);
    const t=await p.locator('[role="log"]').innerText().catch(()=>'');
    if(/high-interest savings \(currently/.test(t)){
      found=true;
      check(/currently 2\.00%/.test(t)&&/1-year GIC at 2\.70%/.test(t),`advisor quotes the table (${(t.match(/currently [^)]*\)[^?]*\?/)||[])[0]})`);
      break;
    }
  }
  check(found,'found the advisor rate message');
  await p.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
