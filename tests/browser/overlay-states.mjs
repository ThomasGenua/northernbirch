import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}); ctx.setDefaultTimeout(6000);
await blockFonts(ctx);
const audit=async(p,label)=>{
  await p.addScriptTag({url:'/axe.min.js'});
  const res=await p.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}}));
  const v=res.violations;
  const n=v.reduce((a,x)=>a+x.nodes.length,0);
  console.log(`\n### ${label}: ${n} violation node(s)`);
  for(const x of v) for(const nd of x.nodes) console.log(`   ${x.id}: ${nd.html.slice(0,110)}`);
  // controls with no accessible name at all, or a symbol-only one
  const bad=await p.evaluate(()=>{
    const out=[];
    for(const el of document.querySelectorAll('input,select,textarea,button')){
      const id=el.id&&document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      const name=(el.getAttribute('aria-label')||(id?id.textContent:'')||el.textContent||'').trim();
      if(el.offsetParent===null)continue;                       // hidden: Netlify's build-time form stubs live in index.html
      if(el.closest('[hidden]')||el.closest('form[netlify]'))continue;
      if(!name||/^[^\p{L}\p{N}]+$/u.test(name)) out.push({tag:el.tagName,ph:el.placeholder||'',html:el.outerHTML.slice(0,95)});
    }
    return out;
  });
  if(bad.length) for(const b of bad) console.log(`   NO-NAME ${b.tag} placeholder=${JSON.stringify(b.ph)} :: ${b.html}`);
  return n+bad.length;
};
let total=0;
// search overlay
{const p=await ctx.newPage();await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1200);
 await p.keyboard.press('Control+k');await p.waitForTimeout(500);
 await p.locator('[role="dialog"] input').fill('mortgage');await p.waitForTimeout(500);
 total+=await audit(p,'search overlay (with results)');await p.close();}
// login modal
{const p=await ctx.newPage();await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1200);
 await p.locator('button',{hasText:/Sign In/i}).first().click();await p.waitForTimeout(600);
 total+=await audit(p,'login modal');await p.close();}
// notifications
{const p=await ctx.newPage();await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1200);
 await p.locator('button[aria-label="Notifications"]').first().click().catch(()=>{});await p.waitForTimeout(600);
 total+=await audit(p,'notifications panel');await p.close();}
// chat widget
{const p=await ctx.newPage();await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1200);
 await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});await p.waitForTimeout(400);
 await p.locator('[aria-label="Open the Northern Birch AI assistant"]').click();await p.waitForTimeout(600);
 total+=await audit(p,'chat widget (open)');await p.close();}
// language menu
{const p=await ctx.newPage();await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1200);
 await p.locator('button',{hasText:'EN'}).first().click();await p.waitForTimeout(500);
 total+=await audit(p,'language menu (open)');await p.close();}
// mobile menu
{const c2=await br.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await blockFonts(c2);
 const p=await c2.newPage();await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1200);
 await p.locator('nav button').last().click().catch(()=>{});await p.waitForTimeout(600);
 total+=await audit(p,'mobile menu (open)');await c2.close();}
console.log(`\nissues in overlay states: ${total}`);
await br.close();
console.log(`\n${total===0?1:0} passed, ${total===0?0:1} failed`);
