import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900}});
ctx.setDefaultTimeout(6000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);

check(await p.evaluate(()=>document.documentElement.lang)==='en','default <html lang> is en');
check(await p.locator('main[lang]').count()===0,'no lang override on main in English');

await p.locator('button',{hasText:'EN'}).first().click(); await p.waitForTimeout(300);
await p.locator('button',{hasText:/Eesti/i}).first().click(); await p.waitForTimeout(800);
check(await p.evaluate(()=>document.documentElement.lang)==='et','<html lang> becomes et');
check(await p.evaluate(()=>localStorage.getItem('nb-lang'))==='est','choice persisted to localStorage');
const notice=await p.locator('body').innerText();
check(notice.includes('ainult inglise keeles'),'Estonian coverage notice shown');
check(await p.locator('a[href="tel:+14164654659"]').count()>=1,'notice offers a callable number');
// the nav is position:fixed -- the notice has to clear it, not hide behind it
{
  const box=await p.locator('p',{hasText:'ainult inglise keeles'}).first().boundingBox();
  const top=await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e?(e.textContent||'').slice(0,40):''},[box.x+box.width/2,box.y+box.height/2]);
  check(/416-465-4659|inglise keeles/.test(top),`notice is not covered by the fixed nav (topmost: ${JSON.stringify(top)})`);
}
check(await p.locator('main[lang="en"]').count()===0,'home stays unmarked (it is translated)');

// reload: the choice must survive
await p.reload({waitUntil:'domcontentloaded'}); await p.waitForTimeout(1000);
check(await p.evaluate(()=>document.documentElement.lang)==='et','choice survives a reload');
check((await p.locator('button').allTextContents()).some(t=>/EST/.test(t)),'badge still EST after reload');

// deep link into an untranslated page
await p.goto(`${BASE}/privacy`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1000);
check(await p.evaluate(()=>document.documentElement.lang)==='et','deep link keeps the chosen language');
check(await p.locator('main[lang="en"]').count()===1,'/privacy body marked lang="en"');

// switch to Latvian, then back to English
await p.locator('button',{hasText:'EST'}).first().click(); await p.waitForTimeout(300);
await p.locator('button',{hasText:/Latvie/i}).first().click(); await p.waitForTimeout(700);
check(await p.evaluate(()=>document.documentElement.lang)==='lv','<html lang> becomes lv');
check((await p.locator('body').innerText()).includes('angļu valodā'),'Latvian coverage notice shown');
await p.locator('button',{hasText:'LAT'}).first().click(); await p.waitForTimeout(300);
await p.locator('button',{hasText:/English/i}).first().click(); await p.waitForTimeout(700);
check(await p.evaluate(()=>document.documentElement.lang)==='en','back to en');
check(!(await p.locator('body').innerText()).includes('angļu valodā'),'notice gone in English');
check(await p.locator('main[lang]').count()===0,'no lang override once back in English');
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
