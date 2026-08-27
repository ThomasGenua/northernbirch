import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
ctx.setDefaultTimeout(7000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};

// capture every form POST and let it succeed, the way Netlify would
const posts=[];
await ctx.route('**/', async (route,req)=>{
  if(req.method()==='POST'){ posts.push({url:req.url(),body:req.postData()||'',ct:req.headers()['content-type']||''}); return route.fulfill({status:200,body:'ok'}); }
  return route.fallback();
});
const parse=(b)=>Object.fromEntries(new URLSearchParams(b));
const newPage=async(r)=>{const p=await ctx.newPage();await p.goto(BASE+r,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1100);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});await p.waitForTimeout(300);return p};

// ---------- referrals ----------
{
  posts.length=0;
  const p=await newPage('/referrals');
  const submit=()=>p.locator('main button',{hasText:'Send Referral'});
  check(await submit().isDisabled(),'referral: submit disabled on an empty form');
  await p.locator('#ref-your-name').fill('Maria Ozols');
  await p.locator('#ref-member-no').fill('44821');
  await p.locator('#ref-friend-name').fill('Juris Berzins');
  await p.locator('#ref-friend-email').fill('juris@example.com');
  await p.waitForTimeout(300);
  check(await submit().isDisabled(),'referral: still disabled until consent is ticked (PIPEDA)');
  await p.locator('#referral-consent').check(); await p.waitForTimeout(300);
  check(!await submit().isDisabled(),'referral: enabled once consent is given');
  await submit().click(); await p.waitForTimeout(900);
  check(posts.length===1,`referral: exactly one POST (${posts.length})`);
  if(posts.length){
    const f=parse(posts[0].body);
    check(f['form-name']==='referral',`referral: form-name=${f['form-name']}`);
    check(f['bot-field']==='','referral: honeypot sent empty');
    check(f.yourName==='Maria Ozols'&&f.friendEmail==='juris@example.com','referral: field values arrive intact');
    check(f.consent==='yes'&&!!f.consentVersion,`referral: consent recorded (${f.consentVersion})`);
    check(posts[0].ct.includes('x-www-form-urlencoded'),'referral: urlencoded content-type Netlify expects');
  }
  const txt=await p.locator('main').innerText();
  check(/Referral Sent/i.test(txt),'referral: confirmation only after a successful POST');
  await p.close();
}

// ---------- booking (a single-page form, not a wizard) ----------
{
  posts.length=0;
  const p=await newPage('/booking');
  const submit=()=>p.locator('main button',{hasText:'Request Appointment'});
  check(await submit().isDisabled(),'booking: submit disabled on an empty form');
  await p.locator('#sel-1').selectOption({index:1});
  await p.locator('#sel-2').selectOption({index:1});
  await p.locator('#booking-date').fill('2026-09-15');
  await p.locator('#sel-3').selectOption({index:1});
  await p.locator('#appt-name').fill('Maria Ozols');
  await p.locator('#appt-email').fill('maria@example.com');
  await p.locator('#appt-phone').fill('416-555-0134');
  await p.waitForTimeout(300);
  check(await submit().isDisabled(),'booking: still disabled until consent is ticked (PIPEDA)');
  await p.locator('#booking-consent').check(); await p.waitForTimeout(300);
  check(!await submit().isDisabled(),'booking: enabled once consent is given');
  await submit().click(); await p.waitForTimeout(900);
  check(posts.length===1,`booking: exactly one POST (${posts.length})`);
  if(posts.length){
    const f=parse(posts[0].body);
    check(f['form-name']==='booking',`booking: form-name=${f['form-name']}`);
    check(f['bot-field']==='','booking: honeypot sent empty');
    check(f.name==='Maria Ozols'&&f.email==='maria@example.com'&&f.phone==='416-555-0134','booking: contact details arrive intact');
    check(!!f.branch&&!!f.service&&f.date==='2026-09-15'&&!!f.time,`booking: appointment details arrive (${f.branch} / ${f.service} / ${f.date} ${f.time})`);
    check(f.consent==='yes'&&!!f.consentVersion,`booking: consent recorded (${f.consentVersion})`);
  }
  check(/confirm|request/i.test(await p.locator('main').innerText()),'booking: confirmation shown after the POST');
  await p.close();
}

// ---------- claims ----------
{
  posts.length=0;
  const p=await newPage('/claims');
  for(let round=0;round<9;round++){
    const inputs=await p.locator('main input:not([type=checkbox]), main select, main textarea').all();
    for(const el of inputs){
      const t=await el.evaluate(e=>e.tagName+'|'+(e.type||''));
      if(t.startsWith('SELECT')){const n=await el.locator('option').count(); if(n>1) await el.selectOption({index:1}).catch(()=>{});}
      else if(/email/.test(t)) await el.fill('maria@example.com').catch(()=>{});
      else if(/\|date\|/.test(t)) await el.fill('2026-09-01').catch(()=>{});
      else if((await el.inputValue().catch(()=>'x'))==='') await el.fill('Kitchen flood after a burst pipe.').catch(()=>{});
    }
    const cb=p.locator('main input[type=checkbox]');
    for(let i=0;i<await cb.count();i++) await cb.nth(i).check().catch(()=>{});
    await p.waitForTimeout(250);
    const next=p.locator('main button',{hasText:/Next|Continue|Submit|Send|File/i}).first();
    if(await next.count()===0||await next.isDisabled().catch(()=>true)){
      const chips=p.locator('main button');
      if(await chips.count()) await chips.first().click().catch(()=>{});
      await p.waitForTimeout(300);
      continue;
    }
    await next.click().catch(()=>{}); await p.waitForTimeout(500);
    if(posts.length) break;
  }
  check(posts.length>=1,`claims: reached a POST (${posts.length})`);
  if(posts.length){
    const f=parse(posts[0].body);
    check(f['form-name']==='claim',`claims: form-name=${f['form-name']}`);
    check(f['bot-field']==='','claims: honeypot sent empty');
    console.log('   claim payload keys:',Object.keys(f).join(', '));
  }
  const txt=await p.locator('main').innerText();
  check(!/claim number is\s*[A-Z0-9-]{4,}/i.test(txt)||/issued by them/i.test(txt),'claims: does not fabricate a claim reference number');
  await p.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
