import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900}}); ctx.setDefaultTimeout(6000);
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const p=await ctx.newPage();
const open=async()=>{await p.keyboard.press('Control+k');await p.waitForTimeout(400)};
await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1200);

await open();
check(await p.locator('[role="dialog"][aria-label="Search Northern Birch"]').count()===1,'Ctrl+K opens search');
check(await p.evaluate(()=>document.activeElement?.tagName)==='INPUT','search input is autofocused');

for(const [q,expectTop] of [['mortgage','Mortgages'],['tfsa','Registered Accounts'],['chequing','Chequing Accounts'],['heloc','Mortgages'],['cash back','Credit Cards'],['gic','GICs'],['credit card','Credit Cards'],['travel insurance','Travel Insurance'],['rates','Rates']]){
  await p.locator('[role="dialog"] input').fill(q); await p.waitForTimeout(300);
  const titles=await p.locator('[role="dialog"] button span:first-child').allTextContents();
  check(titles[0]&&titles[0].includes(expectTop),`search "${q}" ranks ${expectTop} first (got ${JSON.stringify(titles.slice(0,3))})`);
}

// Enter in the input should do something useful
await p.locator('[role="dialog"] input').fill('mortgage'); await p.waitForTimeout(300);
await p.keyboard.press('Enter'); await p.waitForTimeout(600);
check(new URL(p.url()).pathname==='/mortgages',`Enter opens the top result (landed on ${new URL(p.url()).pathname})`);

// arrow keys through results
await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1000);
await open();
await p.locator('[role="dialog"] input').fill('insurance'); await p.waitForTimeout(300);
await p.keyboard.press('ArrowDown'); await p.waitForTimeout(250);
const active=await p.evaluate(()=>document.activeElement?.textContent?.slice(0,40));
check(!!active&&active!=='','ArrowDown moves into results (focus: '+JSON.stringify(active)+')');

// titles that name a specific page should land on that page
await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1000);
for(const [q,title,want] of [['Insurance Dashboard','Insurance Dashboard','/dashboard'],['Smart Quote','Smart Quote Engine','/quote'],['Financial Planning','Financial Planning Tools','/calculators']]){
  await open();
  await p.locator('[role="dialog"] input').fill(q); await p.waitForTimeout(300);
  const b=p.locator('[role="dialog"] button',{hasText:title}).first();
  if(await b.count()===0){check(false,`"${title}" not in index`);continue}
  await b.click(); await p.waitForTimeout(700);
  check(new URL(p.url()).pathname===want,`"${title}" -> ${new URL(p.url()).pathname} (want ${want})`);
  await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(800);
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
