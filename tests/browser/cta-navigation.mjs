import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext(); await blockFonts(ctx);
let pass=0,fail=0;
const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};

// every new CTA: page, button text, expected destination path
const CASES=[
  ['/rates','Explore mortgages','/mortgages'],
  ['/rates','Compare accounts','/accounts'],
  ['/rates','Compare credit cards','/cards'],
  ['/travel','Get a travel quote','/quote'],
  ['/travel','See the mobile app','/mobile-app'],
  ['/travel','Find a branch','/contact'],
  ['/business','Estate & succession','/estate'],
  ['/business','Book a business advisor','/booking'],
  ['/digital','Insurance Dashboard','/dashboard'],
  ['/digital','Life Event Intelligence','/life-event-simulator'],
  ['/digital','Business Hub','/business'],
  ['/community','Meet our board','/leadership'],
  ['/community','Branch hours','/contact'],
  ['/community','Refer a friend','/referrals'],
  ['/blog','See insurance products','/insurance'],
  ['/blog','Take the financial check-up','/financial-health-check'],
  ['/personal','Compare chequing & savings','/accounts'],
  ['/personal','Explore mortgages','/mortgages'],
  ['/mobile-app','Book a setup appointment','/booking'],
];
for(const [from,label,to] of CASES){
  const page=await ctx.newPage();
  await page.goto(BASE+from,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(900);
  const btn=page.locator('main button',{hasText:label}).first();
  if(await btn.count()===0){check(false,`${from} :: "${label}" NOT FOUND`);await page.close();continue}
  await btn.click(); await page.waitForTimeout(600);
  const got=new URL(page.url()).pathname;
  check(got===to,`${from.padEnd(14)} "${label}" -> ${got} (want ${to})`);
  await page.close();
}

// linkified legal pages: hrefs are well-formed and text is not mangled
for(const [route,needles] of [['/privacy',['privacy@northernbirchcu.com','1-800-282-1376','www.priv.gc.ca']],['/complaints',['1-888-451-4519','asaar@northernbirchcu.com']],['/accessibility',['accessibility@northernbirchcu.com']]]){
  const page=await ctx.newPage();
  await page.goto(BASE+route,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(900);
  const links=await page.locator('main a[href]').evaluateAll(a=>a.map(x=>[x.getAttribute('href'),x.textContent]));
  const bad=links.filter(([h])=>/^tel:\+1$|^mailto:$|^https:\/\/$/.test(h)||(h.startsWith('tel:')&&h.replace('tel:+1','').length!==10));
  check(bad.length===0,`${route} all ${links.length} links well-formed${bad.length?' BAD: '+JSON.stringify(bad):''}`);
  const txt=await page.locator('main').innerText();
  for(const n of needles) check(txt.includes(n),`${route} text preserved: ${n}`);
  const ext=links.filter(([h])=>h.startsWith('http'));
  const unsafe=await page.locator('main a[href^="http"]:not([rel*="noopener"])').count();
  check(unsafe===0,`${route} ${ext.length} external links all rel=noopener`);
  await page.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
