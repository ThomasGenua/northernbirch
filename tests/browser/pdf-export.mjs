import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'}); ctx.setDefaultTimeout(8000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const go=async(r)=>{const p=await ctx.newPage();await p.goto(BASE+r,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1100);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});await p.waitForTimeout(250);return p};

// the mortgage calculator: produce a result, then export it
{
  const p=await go('/calculators');
  await p.locator('main button',{hasText:'Calculate Payment'}).click(); await p.waitForTimeout(400);
  const [popup]=await Promise.all([
    p.waitForEvent('popup',{timeout:8000}).catch(()=>null),
    p.locator('main button',{hasText:'Download PDF'}).first().click(),
  ]);
  check(!!popup,'calculators: the PDF export opens a window');
  if(popup){
    await popup.waitForLoadState('domcontentloaded').catch(()=>{});
    await popup.waitForTimeout(700);
    const t=await popup.locator('body').innerText().catch(()=>'');
    check(t.length>50,`calculators: the export has content (${t.length} chars)`);
    check(/Northern Birch/i.test(t),'calculators: the export is branded');
    check(/C\$/.test(t)&&!/NaN|undefined/.test(t),`calculators: the figure carried over (${(t.match(/C\$[\d,.]+/)||[])[0]})`);
    check(/\d{4}/.test(t),'calculators: the export is dated');
    await popup.close();
  }
  await p.close();
}
// the quote page
{
  const p=await go('/quote');
  const [popup]=await Promise.all([
    p.waitForEvent('popup',{timeout:8000}).catch(()=>null),
    p.locator('main button',{hasText:'Download Quote'}).first().click(),
  ]);
  check(!!popup,'quote: the PDF export opens a window');
  if(popup){
    await popup.waitForLoadState('domcontentloaded').catch(()=>{});
    await popup.waitForTimeout(700);
    const t=await popup.locator('body').innerText().catch(()=>'');
    check(/Northern Birch/i.test(t)&&!/NaN|undefined/.test(t),`quote: export is branded and clean (${t.length} chars)`);
    // an insurance quote export must not read as a binding offer
    check(/estimate|illustrat|not (a|an) (offer|contract)|subject to/i.test(t),
      `quote: the export says it is an estimate, not an offer`);
    await popup.close();
  }
  await p.close();
}
// popups blocked: the code alerts rather than failing silently
{
  const c2=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
  await blockFonts(c2);
  const p=await c2.newPage();
  await p.addInitScript(()=>{ window.open=()=>null });
  let alerted='';
  p.on('dialog',async d=>{alerted=d.message();await d.dismiss()});
  await p.goto(BASE+'/calculators',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1100);
  await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{});
  await p.locator('main button',{hasText:'Calculate Payment'}).click(); await p.waitForTimeout(400);
  await p.locator('main button',{hasText:'Download PDF'}).first().click(); await p.waitForTimeout(900);
  check(/pop-?up/i.test(alerted),`blocked popups produce a message, not silence (${JSON.stringify(alerted)})`);
  await c2.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
