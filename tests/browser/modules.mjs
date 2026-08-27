import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900}}); ctx.setDefaultTimeout(7000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const errs=[];
const newPage=async(route)=>{
  const p=await ctx.newPage();
  p.on('pageerror',e=>errs.push(route+': '+String(e).slice(0,120)));
  await p.goto(BASE+route,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1100);
  return p;
};

// ---------- 1. Claims wizard ----------
{
  const p=await newPage('/claims');
  const before=await p.locator('main').innerText();
  await p.locator('main button').first().click(); await p.waitForTimeout(400);
  check((await p.locator('main').innerText())!==before,'claims: step 1 advances');
  let steps=1;
  for(let i=0;i<6;i++){
    const nxt=p.locator('main button',{hasText:/Next|Continue|Submit|Send/i}).first();
    if(await nxt.count()===0||await nxt.isDisabled().catch(()=>true))break;
    await nxt.click(); await p.waitForTimeout(400); steps++;
  }
  check(steps>1,`claims: wizard advances through ${steps} steps`);
  await p.close();
}

// ---------- 2. Financial health check: full 10-question run ----------
{
  const p=await newPage('/financial-health-check');
  let answered=0;
  for(let i=0;i<14;i++){
    const opts=p.locator('main button');
    const n=await opts.count();
    if(n===0)break;
    const txt=await p.locator('main').innerText();
    if(!/Question \d+ of/.test(txt))break;
    await opts.first().click(); await p.waitForTimeout(350); answered++;
  }
  check(answered===10,`health check: answered all 10 questions (got ${answered})`);
  await p.waitForTimeout(2500);
  const end=await p.locator('main').innerText();
  check(!/Question \d+ of/.test(end),'health check: reaches a result screen');
  check(!/NaN|undefined|\[object/.test(end),'health check: result has no NaN/undefined');
  console.log('   result head:',end.replace(/\n/g,' ').slice(0,120));
  await p.close();
}

// ---------- 3. Estate stage tabs ----------
{
  const p=await newPage('/estate');
  const tabs=p.locator('main button');
  const n=await tabs.count();
  const seen=new Set();
  for(let i=0;i<n;i++){ await tabs.nth(i).click(); await p.waitForTimeout(250); seen.add((await p.locator('main h3').first().innerText())); }
  check(seen.size===n&&n===4,`estate: all ${n} stage tabs change the panel (${seen.size} distinct)`);
  await p.close();
}

// ---------- 4. Glossary filter ----------
{
  const p=await newPage('/glossary');
  const all=await p.locator('main h4').count();
  await p.locator('main input').fill('deductible'); await p.waitForTimeout(350);
  const some=await p.locator('main h4').count();
  await p.locator('main input').fill('zzzzqqq'); await p.waitForTimeout(350);
  const none=await p.locator('main h4').count();
  check(all===20&&some===1&&none===0,`glossary: ${all} terms, filter -> ${some}, no-match -> ${none}`);
  await p.close();
}

// ---------- 5. Quote flow ----------
{
  const p=await newPage('/quote');
  const before=await p.locator('main').innerText();
  await p.locator('main button',{hasText:'Home'}).first().click(); await p.waitForTimeout(600);
  check((await p.locator('main').innerText())!==before,'quote: switching product type changes the form');
  await p.close();
}

// ---------- 6. Dashboard transfer ----------
{
  const p=await newPage('/dashboard');
  const amt=p.locator('input[aria-label="Transfer amount in Canadian dollars"]');
  check(await amt.count()===1,'dashboard: transfer amount input is labelled');
  await amt.fill('450'); await p.waitForTimeout(300);
  const send=p.locator('main button',{hasText:/^Send C\$450/}).first();
  check(await send.count()===1,'dashboard: send button reflects the typed amount');
  await send.click(); await p.waitForTimeout(500);
  const txt=await p.locator('main').innerText();
  check(/450/.test(txt)&&!/NaN/.test(txt),'dashboard: transfer confirms without NaN');
  await p.close();
}

// ---------- 7. AI modules degrade gracefully when /api/chat is unavailable ----------
for(const [route,label] of [['/ai-advisor','AI advisor'],['/coverage-analyzer','coverage analyzer'],['/policy-document-reader','doc reader'],['/tax-optimizer','tax optimizer'],['/life-event-simulator','life event sim']]){
  const p=await newPage(route);
  const ta=p.locator('main textarea, main input[type="text"]').first();
  if(await ta.count()) await ta.fill('I am 40, own a home, two kids.').catch(()=>{});
  const btn=p.locator('main button',{hasText:/Analyz|Ask|Submit|Send|Generat|Simulat|Optimiz|Review|Run|Get/i}).last();
  if(await btn.count()===0){check(false,`${label}: no action button found`);await p.close();continue}
  await btn.click().catch(()=>{});
  await p.waitForTimeout(3500);
  const txt=await p.locator('main').innerText();
  const spinning=/Thinking|Analyzing|Loading|\.\.\.$/i.test(txt.trim().slice(-40));
  check(!spinning,`${label}: does not hang on a failed /api/chat (tail: ${JSON.stringify(txt.trim().slice(-60))})`);
  await p.close();
}

// ---------- 8. Chat widget ----------
{
  const p=await newPage('/');
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{}); await p.waitForTimeout(400);
  const launcher=p.locator('[aria-label="Open the Northern Birch AI assistant"]');
  check(await launcher.count()===1,'chat widget: launcher has a real accessible name');
  // the launcher pulses forever, so Playwright never sees it as "stable";
  // force the click rather than reduce motion, to exercise the animated state
  await launcher.click({force:true}).catch(e=>console.log('   launcher click:',e.message.slice(0,60)));
  await p.waitForTimeout(600);
  const inp=p.locator('[aria-label="Ask the Northern Birch assistant a question"]').first();
  check(await inp.count()>=1,'chat widget: opens with an input');
  if(await inp.count()){
    await inp.fill('What are your mortgage rates?');
    await p.keyboard.press('Enter'); await p.waitForTimeout(3500);
    const t=await p.locator('body').innerText();
    check(/trouble connecting|416-465-4659/.test(t),'chat widget: shows the fallback instead of hanging');
  }
  await p.close();
}

// ---------- 9. Login + notifications overlays ----------
{
  const p=await newPage('/');
  await p.locator('button',{hasText:/Sign In/i}).first().click(); await p.waitForTimeout(500);
  check(await p.locator('[role="dialog"]').count()>=1,'login: opens a dialog');
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  check(await p.locator('[role="dialog"]').count()===0,'login: Escape closes it');
  await p.locator('button',{hasText:'🔔'}).first().click().catch(()=>{}); await p.waitForTimeout(500);
  check(await p.locator('[role="dialog"]').count()>=1,'notifications: opens');
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  check(await p.locator('[role="dialog"]').count()===0,'notifications: Escape closes it');
  await p.close();
}

// ---------- 10. Footer links all resolve to real routes ----------
{
  const p=await newPage('/');
  const btns=await p.locator('footer button').count();
  let ok=0,bad=[];
  for(let i=0;i<btns;i++){
    const label=(await p.locator('footer button').nth(i).innerText()).trim();
    await p.locator('footer button').nth(i).click(); await p.waitForTimeout(450);
    const path=new URL(p.url()).pathname;
    const main=(await p.locator('main').innerText()).trim();
    if(path==='/'&&label&&!/home/i.test(label)) bad.push(`${label} -> / `);
    else if(main.length<40) bad.push(`${label} -> ${path} (empty)`);
    else ok++;
    await p.goto(BASE+'/',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(500);
  }
  check(bad.length===0,`footer: ${ok}/${btns} links land on real content${bad.length?' BAD: '+JSON.stringify(bad.slice(0,4)):''}`);
  await p.close();
}

check(errs.length===0,`no page errors anywhere${errs.length?': '+JSON.stringify(errs.slice(0,3)):''}`);
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
