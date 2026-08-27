import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900}}); ctx.setDefaultTimeout(6000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
await p.goto(`${BASE}/dashboard`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1300);
const amt=p.locator('input[aria-label="Transfer amount in Canadian dollars"]');
const send=()=>p.locator('main button',{hasText:/Send C\$|Enter an amount to send/}).first();
const state=async()=>{
  const t=await p.locator('main').innerText();
  const m=t.match(/Recipient Gets\s*\n?\s*(\S+)/);
  return {recip:m?m[1]:'?',label:(await send().innerText()).trim(),disabled:await send().isDisabled()};
};
for(const [v,shouldPass] of [['450',true],['3000',true],['1',true],['25000',true],['abc',false],['',false],['-500',false],['1e9',false],['12.999',false],['0',false],['25001',false],['  700  ',true]]){
  await amt.fill(v); await p.waitForTimeout(300);
  const s=await state();
  const ok=shouldPass? (!s.disabled && !/NaN|--/.test(s.recip)) : (s.disabled && !/NaN/.test(s.recip));
  check(ok,`${JSON.stringify(v).padEnd(10)} ${shouldPass?'accepted':'refused '} -> recipient ${s.recip.padEnd(12)} btn ${JSON.stringify(s.label.slice(0,32))} disabled=${s.disabled}`);
}
// thousands separators everywhere
await amt.fill('3000'); await p.waitForTimeout(300);
const t=await p.locator('main').innerText();
check(/€2,046\.30/.test(t),`recipient figure has separators (${(t.match(/Recipient Gets\s*\n?\s*(\S+)/)||[])[1]})`);
check(/Send C\$3,000\.00/.test(t),'send button formats the amount');
await send().click(); await p.waitForTimeout(500);
const c=await p.locator('main').innerText();
check(/C\$3,000\.00 to/.test(c)&&!/NaN/.test(c),'confirmation formats the amount');
// quote premium separators
const p2=await ctx.newPage();
await p2.goto(`${BASE}/quote`,{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(1200);
for(const s of await p2.locator('main input[type=range]').all()){ await s.focus(); await p2.keyboard.press('End'); }
await p2.waitForTimeout(500);
const q=await p2.locator('main').innerText();
check(!/C\$\d{4,}\.\d\d/.test(q),`quote premiums use separators (${(q.match(/C\$[\d,]+\.\d\d/g)||[]).join(' ')})`);
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
