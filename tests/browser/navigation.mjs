import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};

// ---------- 1. a failing POST must not produce a confirmation ----------
{
  const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'}); ctx.setDefaultTimeout(7000);
  await blockFonts(ctx);
  await ctx.route('**/',(route,req)=>req.method()==='POST'?route.fulfill({status:500,body:'nope'}):route.fallback());
  const p=await ctx.newPage();
  await p.goto(BASE+'/referrals',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1100);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});
  await p.locator('#ref-your-name').fill('Maria Ozols');
  await p.locator('#ref-friend-name').fill('Juris Berzins');
  await p.locator('#ref-friend-email').fill('juris@example.com');
  await p.locator('#referral-consent').check(); await p.waitForTimeout(300);
  await p.locator('main button',{hasText:'Send Referral'}).click(); await p.waitForTimeout(1200);
  const t=await p.locator('main').innerText();
  check(!/Referral Sent/i.test(t),'referral: a 500 does NOT show "Referral Sent"');
  check(/could not send|try again|416-465-4659/i.test(t),`referral: shows a real error instead (${JSON.stringify(t.match(/We could not[^\n]*/)?.[0]||'').slice(0,70)})`);
  check(await p.locator('#ref-your-name').inputValue()==='Maria Ozols','referral: keeps what you typed so you can retry');
  await ctx.close();
}

// ---------- 2. browser back / forward through the SPA router ----------
{
  const ctx=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}); ctx.setDefaultTimeout(7000);
  await blockFonts(ctx);
  const p=await ctx.newPage();
  await p.goto(BASE+'/',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1100);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{}); await p.waitForTimeout(300);
  const trail=[];
  for(const [label,want] of [['Insurance','/insurance'],['Travel','/travel'],['Rates','/rates'],['Community','/community']]){
    await p.locator('nav button',{hasText:new RegExp('^'+label+'$')}).first().click(); await p.waitForTimeout(600);
    const got=new URL(p.url()).pathname;
    check(got===want,`nav ${label} -> ${got}`);
    trail.push(got);
  }
  // back through every step
  for(let i=trail.length-2;i>=0;i--){
    await p.goBack(); await p.waitForTimeout(600);
    const got=new URL(p.url()).pathname;
    const heading=(await p.locator('main h1, main h2').first().innerText().catch(()=>'')).slice(0,40);
    check(got===trail[i],`back -> ${got} (want ${trail[i]}) heading=${JSON.stringify(heading)}`);
    check(heading.length>0,`back: ${got} actually re-rendered its page`);
  }
  await p.goBack(); await p.waitForTimeout(600);
  check(new URL(p.url()).pathname==='/',`back to home -> ${new URL(p.url()).pathname}`);
  // forward again
  await p.goForward(); await p.waitForTimeout(600);
  check(new URL(p.url()).pathname==='/insurance',`forward -> ${new URL(p.url()).pathname}`);
  // an unknown path falls back to home without erroring
  await p.goto(BASE+'/no-such-page',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(900);
  const main=(await p.locator('main').innerText()).trim();
  check(main.length>200,`unknown path renders something (${main.length} chars)`);
  // the document title tracks the route
  await p.goto(BASE+'/mortgages',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(900);
  const t1=await p.title();
  await p.locator('nav button',{hasText:/^Rates$/}).first().click(); await p.waitForTimeout(700);
  const t2=await p.title();
  check(t1!==t2&&/Rates|Northern Birch/i.test(t2),`title updates on client-side nav (${JSON.stringify(t1.slice(0,32))} -> ${JSON.stringify(t2.slice(0,32))})`);
  await ctx.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
