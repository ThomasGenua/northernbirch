import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
ctx.setDefaultTimeout(7000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};

// Capture every form POST and let it succeed, standing in for the Netlify
// function. The forms used to post to "/" (Netlify Forms, which stored every
// submission); they post to /api/demo-intake now, which discards the body --
// see docs/DATA-RETENTION.md. The static server behind these suites serves
// files only, so the endpoint is stubbed here.
const posts=[];
await ctx.route('**/api/demo-intake*', async (route,req)=>{
  posts.push({url:req.url(),body:req.postData()||'',ct:req.headers()['content-type']||''});
  return route.fulfill({status:200,contentType:'application/json',
    body:JSON.stringify({ok:true,stored:false,message:'This is a demonstration. Your details were not saved, sent, or shared with anyone.'})});
});
await ctx.route('**/', async (route,req)=>{
  if(req.method()==='POST'){ posts.push({url:req.url(),body:req.postData()||'',ct:req.headers()['content-type']||'',toRoot:true}); return route.fulfill({status:200,body:'ok'}); }
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
    // The form is named in the query string now, not in a "form-name" body
    // field -- that field was Netlify Forms' convention, and these no longer
    // post to Netlify Forms.
    check(new URL(posts[0].url).searchParams.get('form')==='referral',`referral: posts as form={referral} (${new URL(posts[0].url).searchParams.get('form')})`);
    check(!('form-name' in f),'referral: carries no Netlify form-name field');
    check(f['bot-field']==='','referral: honeypot sent empty');
    check(f.yourName==='Maria Ozols'&&f.friendEmail==='juris@example.com','referral: field values arrive intact');
    check(f.consent==='yes'&&!!f.consentVersion,`referral: consent recorded (${f.consentVersion})`);
    check(posts[0].ct.includes('x-www-form-urlencoded'),'referral: urlencoded content-type the endpoint expects');
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
    // The form is named in the query string now, not in a "form-name" body
    // field -- that field was Netlify Forms' convention, and these no longer
    // post to Netlify Forms.
    check(new URL(posts[0].url).searchParams.get('form')==='booking',`booking: posts as form={booking} (${new URL(posts[0].url).searchParams.get('form')})`);
    check(!('form-name' in f),'booking: carries no Netlify form-name field');
    check(f['bot-field']==='','booking: honeypot sent empty');
    check(f.name==='Maria Ozols'&&f.email==='maria@example.com'&&f.phone==='416-555-0134','booking: contact details arrive intact');
    check(!!f.branch&&!!f.service&&f.date==='2026-09-15'&&!!f.time,`booking: appointment details arrive (${f.branch} / ${f.service} / ${f.date} ${f.time})`);
    check(f.consent==='yes'&&!!f.consentVersion,`booking: consent recorded (${f.consentVersion})`);
  }
  check(/confirm|request/i.test(await p.locator('main').innerText()),'booking: confirmation shown after the POST');
  await p.close();
}

// ---------- claims ----------
// Claims are a "who to call" guide now: no form, nothing posted, and only
// numbers from content/facts.json.
{
  posts.length=0;
  const p=await newPage('/claims');
  check(await p.locator('main input, main textarea, main select').count()===0,'claims: collects nothing (no inputs)');
  const known=JSON.parse(readFileSync(new URL('../../content/facts.json',import.meta.url),'utf8')).phones.map(x=>x.number);
  for(const label of ['Insurance on my Collabria card','Travel insurance','Home, auto, tenant','Insurance on a Northern Birch loan']){
    await p.locator('main button',{hasText:label}).first().click(); await p.waitForTimeout(300);
    const t=await p.locator('main').innerText();
    const nums=t.match(/(?:1-)?\d{3}-\d{3}-\d{4}/g)||[];
    check(/^Call /m.test(t)&&nums.every(n=>known.includes(n)),`claims: "${label}" says who to call, with known numbers only (${[...new Set(nums)].join(', ')})`);
    await p.locator('main button',{hasText:'Choose a different claim'}).click(); await p.waitForTimeout(250);
  }
  check(posts.length===0,'claims: nothing is posted');
  await p.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
