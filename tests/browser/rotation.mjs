import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}); ctx.setDefaultTimeout(8000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
const rotate=async()=>{ await p.setViewportSize({width:844,height:390}); await p.waitForTimeout(700); };
const rotateBack=async()=>{ await p.setViewportSize({width:390,height:844}); await p.waitForTimeout(700); };

// a half-filled booking form must survive a rotation
await p.goto(`${BASE}/booking`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);
await p.locator('button',{hasText:'Essential only'}).click().catch(()=>{}); await p.waitForTimeout(250);
await p.locator('#appt-name').fill('Maria Ozols');
await p.locator('#appt-email').fill('maria@example.com');
await p.locator('#sel-1').selectOption({index:1});
await p.locator('#booking-consent').check();
await rotate();
check(await p.locator('#appt-name').inputValue()==='Maria Ozols','booking: the name survives a rotation');
check(await p.locator('#appt-email').inputValue()==='maria@example.com','booking: the email survives');
check(await p.locator('#booking-consent').isChecked(),'booking: the consent tick survives');
check((await p.locator('#sel-1').inputValue())!=='','booking: the branch choice survives');
await rotateBack();
check(await p.locator('#appt-name').inputValue()==='Maria Ozols','booking: and survives rotating back');

// a quiz in progress must not restart
await p.goto(`${BASE}/financial-health-check`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);
for(let i=0;i<3;i++){ await p.locator('main button').first().click(); await p.waitForTimeout(300); }
const before=(await p.locator('main').innerText()).match(/Question (\d+) of/)?.[1];
await rotate();
const after=(await p.locator('main').innerText()).match(/Question (\d+) of/)?.[1];
check(before===after,`health check: still on question ${after} after rotating (was ${before})`);

// a calculator result must not vanish
await p.goto(`${BASE}/calculators`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);
await p.locator('main button',{hasText:'Calculate Payment'}).click(); await p.waitForTimeout(400);
const res=(await p.locator('#mortgage-result').innerText()).split('\n')[1];
await rotate();
check(await p.locator('#mortgage-result').count()===1,`calculators: the result survives a rotation (${res})`);

// an open overlay must not be dismissed by a rotation
await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);
await p.locator('button[aria-label="Search Northern Birch"]:visible').first().click(); await p.waitForTimeout(500);
await p.locator('[role="dialog"] input').fill('mortgage'); await p.waitForTimeout(400);
await rotate();
check(await p.locator('[role="dialog"]').count()===1,'search: the overlay stays open through a rotation');
check(await p.locator('[role="dialog"] input').inputValue()==='mortgage','search: and keeps what was typed');
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
