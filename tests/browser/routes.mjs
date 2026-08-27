import { chromium } from 'playwright-core';
import { BASE, ROUTES, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext();
await blockFonts(ctx);
let fails=0;
for(const r of ROUTES){
  const page=await ctx.newPage();
  const errs=[];
  page.on('pageerror',e=>errs.push(String(e).slice(0,140)));
  page.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/fonts\.g/.test(t)&&!/ERR_FAILED/.test(t))errs.push('console: '+t.slice(0,140))}});
  await page.goto(BASE+r,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1200);
  // interactive elements inside <main>, excluding the persistent chat launcher
  const n=await page.locator('main a[href], main button, main input, main select, main textarea').count();
  const text=(await page.locator('main').innerText()).trim();
  const tel=await page.locator('main a[href^="tel:"]').count();
  const flags=[];
  if(errs.length)flags.push('ERRORS: '+errs.slice(0,2).join(' | '));
  if(n===0)flags.push('NO INTERACTIVE ELEMENTS');
  // A quiz renders one question at a time, so a short body is correct there.
  const QUIZ=['/financial-health-check'];
  if(text.length<200&&!QUIZ.includes(r))flags.push(`THIN (${text.length} chars)`);
  if(flags.length)fails++;
  console.log(`${flags.length?'FAIL':'ok  '} ${r.padEnd(28)} interactive=${String(n).padStart(3)} tel=${tel} chars=${String(text.length).padStart(5)} ${flags.join('; ')}`);
  await page.close();
}
console.log(`\n${ROUTES.length-fails} passed, ${fails} failed`);
await br.close();
