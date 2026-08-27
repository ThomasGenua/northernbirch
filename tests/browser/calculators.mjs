import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900}}); ctx.setDefaultTimeout(6000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
await p.goto(`${BASE}/calculators`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1500);
const mort=async(amt,rate,yrs)=>{
  await p.locator('#calc-0').fill(String(amt));
  await p.locator('#calc-1').fill(String(rate));
  if(yrs) await p.locator('#sel-0').selectOption(String(yrs));
  await p.locator('main button',{hasText:'Calculate Payment'}).click(); await p.waitForTimeout(300);
  const err=await p.locator('[role="alert"]').count()?await p.locator('[role="alert"]').innerText():'';
  const res=await p.locator('#mortgage-result').count()?(await p.locator('#mortgage-result').innerText()).split('\n')[1]:'';
  return {err,res};
};
// Canadian semi-annual compounding
check((await mort(500000,4.39,25)).res==='C$2,736.87','500k @4.39% 25y = C$2,736.87 (semi-annual, was 2,748.04)');
check((await mort(300000,5.54,20)).res==='C$2,059.79','300k @5.54% 20y = C$2,059.79');
// 0% used to silently render nothing
const z=await mort(500000,0,25);
check(z.res==='C$1,666.67',`0% interest returns principal/months (got ${JSON.stringify(z.res)})`);
// nonsense inputs are refused out loud, not answered
for(const [amt,rate,frag] of [[-100000,4.39,'greater than zero'],[0,4.39,'greater than zero'],[500000,-2,'between 0% and 25%'],[500000,999,'between 0% and 25%']]){
  const r=await mort(amt,rate,25);
  check(r.err.includes(frag)&&r.res==='',`amount=${amt} rate=${rate} refused: ${JSON.stringify(r.err.slice(0,50))}`);
}
// a valid run afterwards clears the error
const ok=await mort(500000,4.39,25);
check(ok.err===''&&ok.res==='C$2,736.87','a valid calculation clears the error banner');
// posted rates in the footnote come from the rate table
check((await p.locator('#mortgage-result').innerText()).includes('3-year closed 4.39%'),'footnote reads the posted rate table');

// retirement guards
await p.locator('main button',{hasText:'Retirement'}).click(); await p.waitForTimeout(400);
const ret=async(age,retire,rtn)=>{
  await p.locator('#calc-5').fill(String(age));
  await p.locator('#calc-6').fill(String(retire));
  await p.locator('#calc-10').fill(String(rtn));
  await p.locator('main button',{hasText:'Calculate Retirement Plan'}).click(); await p.waitForTimeout(300);
  const err=await p.locator('[role="alert"]').count()?await p.locator('[role="alert"]').innerText():'';
  const has=await p.locator('#retirement-result').count();
  return {err,has,text:has?await p.locator('#retirement-result').innerText():''};
};
let r=await ret(65,35,6); check(r.err.includes('later than your current age')&&!r.has,'retiring before you are born is refused');
r=await ret(35,95,6);     check(r.err.includes('below that')&&!r.has,'retirement age past 90 is refused');
r=await ret(35,65,0);     check(r.err===''&&r.has&&!/NaN/.test(r.text),`0% return still projects (no NaN)`);
r=await ret(35,65,6);     check(r.err===''&&r.has&&!/NaN/.test(r.text),'normal retirement projection works');

// insurance needs guards
await p.locator('main button',{hasText:'Insurance Needs'}).click(); await p.waitForTimeout(400);
await p.locator('#calc-2').fill('-5000');
await p.locator('main button',{hasText:'Calculate Insurance Need'}).click(); await p.waitForTimeout(300);
check((await p.locator('[role="alert"]').innerText()).includes('cannot be negative'),'negative income is refused');
await p.locator('#calc-2').fill('100000');
await p.locator('main button',{hasText:'Calculate Insurance Need'}).click(); await p.waitForTimeout(300);
check(await p.locator('#insurance-needs-result').count()===1,'valid insurance need calculates');
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
