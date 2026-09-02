import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}); ctx.setDefaultTimeout(8000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
const cols=()=>p.evaluate(()=>{for(const d of document.querySelectorAll('main div')){const g=getComputedStyle(d).gridTemplateColumns;if(g&&g!=='none')return g.trim().split(/\s+/).length}return 0});
// resizing matches a fresh load at the same width, in both directions
for(const route of ['/business','/contact','/personal','/travel','/insurance','/rates']){
  await p.setViewportSize({width:1280,height:900});
  await p.goto(BASE+route,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(900);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{}); await p.waitForTimeout(200);
  await p.setViewportSize({width:390,height:844}); await p.waitForTimeout(700);
  const shrunk=await cols();
  await p.setViewportSize({width:1280,height:900}); await p.waitForTimeout(700);
  const grown=await cols();
  await p.reload({waitUntil:'domcontentloaded'}); await p.waitForTimeout(900);
  const fresh=await cols();
  check(grown===fresh,`${route.padEnd(11)} shrink->${shrunk}, grow back->${grown}, fresh at 1280->${fresh}`);
}
// the nav's own breakpoint (900) reacts too
await p.setViewportSize({width:1280,height:900});
await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1000);
await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});
// Both nav forms are in the markup now -- CSS decides which one a viewport
// gets, so what matters is which is *shown*, not which exists.
const burger=p.locator('button[aria-label="Open menu"]');
const links=p.locator('.nav-wide');
check(!await burger.isVisible()&&await links.isVisible(),'desktop: the link row, no hamburger');
await p.setViewportSize({width:390,height:844}); await p.waitForTimeout(700);
check(await burger.isVisible()&&!await links.isVisible(),'shrinking to a phone reveals the hamburger without a reload');
await p.setViewportSize({width:1280,height:900}); await p.waitForTimeout(700);
check(!await burger.isVisible()&&await links.isVisible(),'growing back hides it again');
// a drag across the whole range must not throw
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,70)));
for(let w=1400;w>=340;w-=40){ await p.setViewportSize({width:w,height:800}); await p.waitForTimeout(40); }
await p.waitForTimeout(600);
check(errs.length===0,`dragging from 1400px to 340px raises no errors${errs.length?': '+errs[0]:''}`);
check((await p.locator('main').innerText()).length>200,'and the page still renders at the end of the drag');
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
