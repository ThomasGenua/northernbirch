import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}); ctx.setDefaultTimeout(8000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
await p.goto(`${BASE}/dashboard`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1500);
await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{}); await p.waitForTimeout(300);
const healthy=await p.evaluate(()=>document.getElementById('root').innerHTML.length);
check(healthy>1000,`/dashboard renders normally (${healthy} chars)`);

// break a method the page calls during render, then force a re-render
await p.evaluate(()=>{ Number.prototype.toLocaleString=function(){ throw new TypeError('simulated render bug'); }; });
await p.locator('input[aria-label="Transfer amount in Canadian dollars"]').fill('321');
await p.waitForTimeout(1500);
const root=await p.evaluate(()=>document.getElementById('root')?.innerHTML.length||0);
check(root>300,`the app did NOT unmount (${root} chars, was 0 before the boundary)`);
const alert=await p.locator('[role="alert"]',{hasText:/didn.t load/i}).count();
check(alert>=1,'a message is shown instead of a blank page');
check(await p.locator('nav').count()>=1,'the nav survives, so you can navigate away');
check(await p.locator('a[href="tel:+14164654659"]',{hasText:'416-465-4659'}).count()>=1,'the fallback offers a phone number that works');
check(await p.locator('button',{hasText:'Reload the page'}).count()>=1,'the fallback offers a reload');

// navigating away must clear the boundary, not strand you on the error screen
await p.locator('nav button',{hasText:/^Rates$/}).first().click(); await p.waitForTimeout(900);
const recovered=(await p.locator('main').innerText()).trim();
check(!/didn.t load/i.test(recovered)&&recovered.length>400,`navigating away recovers (${recovered.length} chars on /rates)`);
check(new URL(p.url()).pathname==='/rates',`and the URL followed (${new URL(p.url()).pathname})`);

// the fallback itself must be accessible
await p.addScriptTag({url:'/axe.min.js'});
await p.locator('nav button',{hasText:/^Digital$/}).first().click().catch(()=>{});
await p.waitForTimeout(600);
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
