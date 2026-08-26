import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
for(const [w,h,tag] of [[1280,900,'desktop'],[390,844,'mobile'],[768,700,'tablet']]){
  const ctx=await br.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
  await blockFonts(ctx);
  const p=await ctx.newPage();
  await p.goto(`${BASE}/`,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1400);
  const clear=async()=>p.evaluate(()=>{
    const btn=document.querySelector('[aria-label="Open the Northern Birch AI assistant"]');
    if(!btn)return 'no launcher';
    const b=btn.getBoundingClientRect();
    // it is a circle: sample the centre and four points well inside the radius
    const cx=b.x+b.width/2, cy=b.y+b.height/2, r=b.width*0.3;
    const pts=[[cx,cy],[cx-r,cy],[cx+r,cy],[cx,cy-r],[cx,cy+r]];
    return pts.map(([x,y])=>{const e=document.elementFromPoint(x,y);return e&&btn.contains(e)||e===btn;}).every(Boolean);
  });
  check(await clear()===true,`${tag}: launcher fully clickable with the cookie banner up`);
  // and it actually opens
  await p.locator('[aria-label="Open the Northern Birch AI assistant"]').click();
  await p.waitForTimeout(500);
  check(await p.locator('[aria-label="Ask the Northern Birch assistant a question"]').count()===1,`${tag}: chat opens over the banner`);
  const overlap=await p.evaluate(()=>{
    const panel=document.querySelector('[aria-label="Ask the Northern Birch assistant a question"]').closest('div[style*="position: fixed"]');
    const banner=document.querySelector('[role="region"][aria-label="Cookie preferences"]');
    if(!panel||!banner)return 'n/a';
    const a=panel.getBoundingClientRect(), b=banner.getBoundingClientRect();
    return a.bottom<=b.top+1;
  });
  check(overlap===true||overlap==='n/a',`${tag}: open panel sits above the banner (${overlap})`);
  // dismiss and confirm the launcher drops back down
  await p.keyboard.press('Escape').catch(()=>{});
  await p.locator('button',{hasText:'Essential only'}).click(); await p.waitForTimeout(600);
  const bottom=await p.evaluate(()=>{
    const el=document.querySelector('[aria-label="Open the Northern Birch AI assistant"]')||document.querySelector('[aria-label="Ask the Northern Birch assistant a question"]').closest('div[style*="position: fixed"]');
    return Math.round(window.innerHeight-el.getBoundingClientRect().bottom);
  });
  check(bottom===24,`${tag}: returns to bottom:24 once the banner is answered (got ${bottom})`);
  await ctx.close();
}
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
