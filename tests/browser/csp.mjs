import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
await blockFonts(ctx);
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const viol=[];
for(const route of ['/','/mortgages','/privacy']){
  const p=await ctx.newPage();
  p.on('console',m=>{ if(/Content Security Policy|Refused to/i.test(m.text())) viol.push(route+': '+m.text().slice(0,110)); });
  await p.goto(BASE+route,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(1400);
  const ld=await p.evaluate(()=>{
    const el=document.querySelector('script[type="application/ld+json"]');
    if(!el)return null;
    try{return JSON.parse(el.textContent)}catch(e){return 'PARSE ERROR'}
  });
  check(ld&&ld!=='PARSE ERROR'&&ld['@type']==='BankOrCreditUnion',`${route}: JSON-LD present and parses from the live DOM`);
  // the image must actually load under img-src 'self'
  const ok=await p.evaluate(()=>new Promise(r=>{const i=new Image();i.onload=()=>r(true);i.onerror=()=>r(false);i.src='/og-image.png'}));
  check(ok,`${route}: og-image.png loads under the CSP`);
  await p.close();
}
check(viol.length===0,`no CSP violations reported${viol.length?': '+JSON.stringify(viol.slice(0,2)):''}`);
console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
