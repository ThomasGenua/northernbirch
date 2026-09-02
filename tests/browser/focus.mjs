import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'}); ctx.setDefaultTimeout(7000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
await p.goto(BASE+'/',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1100);
await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{}); await p.waitForTimeout(300);
const who=()=>p.evaluate(()=>{const a=document.activeElement;return a?(a.getAttribute('aria-label')||(a.textContent||'').trim().slice(0,24)||a.tagName):'none'});

// each overlay: focus enters, is trapped, and returns to its trigger
for(const [name,openIt,inside] of [
  ['search',   async()=>p.locator('button[aria-label="Search Northern Birch"]:visible').first().focus(), 'Search products, services and tools'],
  ['login',    async()=>p.locator('button',{hasText:/^Sign In$/}).first().focus(), null],
  ['notifications', async()=>p.locator('button[aria-label="Notifications"]:visible').first().focus(), null],
]){
  await openIt(); await p.waitForTimeout(200);
  const trigger=await who();          // capture AFTER focusing the trigger
  await p.keyboard.press('Enter'); await p.waitForTimeout(600);
  const got=await who();
  check(await p.locator('[role="dialog"]').count()>=1,`${name}: opens`);
  if(inside) check(got===inside,`${name}: focus lands inside (${got})`);
  else check(await p.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]')),`${name}: focus lands inside the dialog (${got})`);
  let escaped=false;
  for(let i=0;i<30;i++){ await p.keyboard.press('Tab');
    if(!await p.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]'))){escaped=true;break} }
  check(!escaped,`${name}: Tab stays trapped`);
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  check(await p.locator('[role="dialog"]').count()===0,`${name}: Escape closes it`);
  const back=await who();
  check(back===trigger,`${name}: focus returns to its trigger (${back} vs ${trigger})`);
}
// typing in search must not yank focus back to the top
await p.locator('button[aria-label="Search Northern Birch"]:visible').first().click(); await p.waitForTimeout(500);
await p.keyboard.type('mortgage'); await p.waitForTimeout(500);
check(await who()==='Search products, services and tools','search: focus stays in the input while typing');
await p.keyboard.press('ArrowDown'); await p.waitForTimeout(300);
const onResult=await who();
await p.waitForTimeout(700);   // let any stray re-render land
check(await who()===onResult,`search: focus is not yanked back by a re-render (stayed on ${onResult})`);
await p.keyboard.press('Escape'); await p.waitForTimeout(400);
{const b=await who();check(b==='Search Northern Birch',`search: still restores after arrowing through results (got ${JSON.stringify(b)})`);}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
