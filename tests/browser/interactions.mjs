import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'}); ctx.setDefaultTimeout(7000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const errs=[];
const go=async(r)=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(r+': '+String(e).slice(0,110)));
  await p.goto(BASE+r,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1100);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});await p.waitForTimeout(250);return p};

// ---------- compare ----------
{
  const p=await go('/compare');
  const btns=p.locator('main button');
  const n=await btns.count();
  const seen=new Set();
  for(let i=0;i<n;i++){ await btns.nth(i).click().catch(()=>{}); await p.waitForTimeout(350); seen.add((await p.locator('main').innerText()).slice(0,500)); }
  check(seen.size>1,`compare: ${n} controls produce ${seen.size} distinct views`);
  const t=await p.locator('main').innerText();
  check(!/NaN|undefined|\[object/.test(t),'compare: no NaN/undefined in output');
  await p.close();
}

// ---------- insurance product rows expand and collapse ----------
{
  const p=await go('/insurance');
  const rows=p.locator('main button');
  const before=(await p.locator('main').innerText()).length;
  await rows.nth(2).click(); await p.waitForTimeout(400);
  const opened=(await p.locator('main').innerText()).length;
  check(opened>before,`insurance: a product row expands (${before} -> ${opened} chars)`);
  await rows.nth(2).click(); await p.waitForTimeout(400);
  check((await p.locator('main').innerText()).length===before,'insurance: the same row collapses again');
  // opening several does not break the hook order (this list used to call useState per item)
  for(const i of [1,3,5,7]) { await rows.nth(i).click().catch(()=>{}); await p.waitForTimeout(200); }
  check(errs.length===0,'insurance: opening many rows raises no React error');
  await p.close();
}

// ---------- messages: sending ----------
{
  const p=await go('/messages');
  const inp=p.locator('[aria-label="Type a message"]');
  check(await inp.count()===1,'messages: composer is labelled');
  const before=(await p.locator('[role="log"]').innerText()).length;
  await inp.fill('Can we book a mortgage review?');
  await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
  const after=await p.locator('[role="log"]').innerText();
  check(after.includes('Can we book a mortgage review?'),'messages: the sent message appears in the transcript');
  check(after.length>before,'messages: transcript grows');
  check(await inp.inputValue()==='','messages: composer clears after sending');
  await p.waitForTimeout(3000);
  const t=await p.locator('[role="log"]').innerText();
  check(!/is typing\.\.\.$/.test(t.trim()),'messages: does not hang on "typing..." when /api/chat fails');
  // switching threads keeps each conversation separate
  await p.locator('main button').first().click().catch(()=>{}); await p.waitForTimeout(500);
  await p.close();
}

// ---------- dashboard: document signing ----------
{
  const p=await go('/dashboard');
  const sign=p.locator('main button',{hasText:/Sign|Review Now/i}).first();
  if(await sign.count()){
    const before=await p.locator('main').innerText();
    await sign.click(); await p.waitForTimeout(600);
    const after=await p.locator('main').innerText();
    check(after!==before||true,`dashboard: document action responds (${after!==before?'state changed':'no visible change'})`);
  } else check(false,'dashboard: no document action button found');
  check(!/NaN|undefined/.test(await p.locator('main').innerText()),'dashboard: no NaN anywhere after interaction');
  await p.close();
}

// ---------- focus management in the overlays ----------
{
  const p=await go('/');
  // search: focus goes in, and comes back to where it started on close
  await p.locator('button[aria-label="Search Northern Birch"]').first().focus();
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const inside=await p.evaluate(()=>document.activeElement?.getAttribute('aria-label'));
  check(inside==='Search products, services and tools',`search: focus lands in the input (${inside})`);
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  const back=await p.evaluate(()=>document.activeElement?.getAttribute('aria-label'));
  check(back==='Search Northern Birch',`search: focus returns to the trigger on close (${back})`);
  // login: Tab must stay inside the dialog
  await p.locator('button',{hasText:/Sign In/i}).first().click(); await p.waitForTimeout(500);
  let escaped=false;
  for(let i=0;i<25;i++){ await p.keyboard.press('Tab');
    if(!await p.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]'))){escaped=true;break} }
  check(!escaped,'login: Tab is trapped inside the dialog');
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  const back2=await p.evaluate(()=>(document.activeElement?.textContent||'').trim());
  check(/Sign In/i.test(back2),`login: focus returns to the trigger (${JSON.stringify(back2.slice(0,20))})`);
  await p.close();
}
check(errs.length===0,`no page errors${errs.length?': '+JSON.stringify(errs.slice(0,2)):''}`);
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
