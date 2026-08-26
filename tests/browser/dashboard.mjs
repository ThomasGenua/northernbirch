import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}); ctx.setDefaultTimeout(7000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const go=async(r)=>{const p=await ctx.newPage();await p.goto(BASE+r,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1100);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});await p.waitForTimeout(250);return p};

// the six quick actions that route
for(const [label,want] of [['Get Insurance Quote','/quote'],['File Insurance Claim','/claims'],['Book Advisor Meeting','/booking'],['Update Beneficiaries','/booking'],['Apply for Credit Card','/cards']]){
  const p=await go('/dashboard');
  await p.locator('main button',{hasText:label}).first().click(); await p.waitForTimeout(600);
  check(new URL(p.url()).pathname===want,`quick action "${label}" -> ${new URL(p.url()).pathname} (want ${want})`);
  await p.close();
}
// the three scroll-and-focus actions
for(const [label,anchor] of [['Send International Transfer','dash-transfer'],['Send Transfer','dash-transfer'],['Sign Now','dash-documents']]){
  const p=await go('/dashboard');
  await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(200);
  const before=await p.evaluate(()=>window.scrollY);
  await p.locator('main button',{hasText:new RegExp('^'+label)}).first().click(); await p.waitForTimeout(800);
  const after=await p.evaluate(()=>window.scrollY);
  const inView=await p.evaluate((id)=>{const e=document.getElementById(id);if(!e)return false;const r=e.getBoundingClientRect();return r.top<window.innerHeight&&r.bottom>0},anchor);
  const focused=await p.evaluate((id)=>{const e=document.getElementById(id);return !!(e&&e.contains(document.activeElement))},anchor);
  check(inView&&(after!==before||focused),`"${label}" brings #${anchor} into view (scroll ${before}->${after}, focus inside=${focused})`);
  await p.close();
}
// the other two routing buttons
for(const [label,want] of [['Close Coverage Gaps','/coverage-analyzer'],['Review Now','/compare'],['Message Heili','/messages'],['Reschedule','/booking'],['Account Settings','/contact']]){
  const p=await go('/dashboard');
  await p.locator('main button',{hasText:label}).first().click(); await p.waitForTimeout(600);
  check(new URL(p.url()).pathname===want,`"${label}" -> ${new URL(p.url()).pathname} (want ${want})`);
  await p.close();
}
// the online-banking items are no longer fake buttons
{
  const p=await go('/dashboard');
  const t=await p.locator('main').innerText();
  check(/In online banking/i.test(t),'online-banking items are listed, not dressed as buttons');
  for(const l of ['Pay a bill','Send an Interac e-Transfer','Download tax slips','Order foreign currency cash'])
    check(await p.locator('main button',{hasText:l}).count()===0,`"${l}" is no longer a button`);
  check(await p.locator('main button',{hasText:'Call your branch'}).count()===1,'a real "Call your branch" action is offered instead');
  await p.close();
}
// compare: the three quote buttons, and the tab no-op is legitimate
{
  const p=await go('/compare');
  const tabs=p.locator('main button',{hasText:'Term Life Insurance'});
  const wasActive=await tabs.first().evaluate(e=>getComputedStyle(e).backgroundColor);
  await tabs.first().click(); await p.waitForTimeout(400);
  check(await tabs.first().evaluate(e=>getComputedStyle(e).backgroundColor)===wasActive,'compare: clicking the already-selected tab correctly does nothing');
  const q=p.locator('main button',{hasText:'Get a Quote'});
  check(await q.count()===3,`compare: 3 quote buttons (${await q.count()})`);
  await q.nth(1).click(); await p.waitForTimeout(600);
  check(new URL(p.url()).pathname==='/quote',`compare: "Get a Quote" -> ${new URL(p.url()).pathname}`);
  await p.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
