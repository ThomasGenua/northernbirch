import { chromium } from 'playwright-core';
import { BASE, ROUTES, EXECUTABLE, blockFonts } from './env.mjs';

const br=await chromium.launch({executablePath:EXECUTABLE});
const ctx=await br.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
await blockFonts(ctx);
let total=0;
for(const r of ROUTES){
  const p=await ctx.newPage();
  await p.goto(BASE+r,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(900);
  const dupes=await p.evaluate(()=>{
    const seen={},out=[];
    for(const el of document.querySelectorAll('[id]')){
      seen[el.id]=(seen[el.id]||0)+1;
      if(seen[el.id]===2)out.push(el.id);
    }
    return out;
  });
  // a <label for=X> pointing at nothing is just as broken
  const orphans=await p.evaluate(()=>[...document.querySelectorAll('label[for]')]
    .filter(l=>!document.getElementById(l.getAttribute('for')))
    .map(l=>l.getAttribute('for')));
  if(dupes.length||orphans.length){
    total+=dupes.length+orphans.length;
    console.log(`${r}: ${dupes.length?'duplicate ids '+JSON.stringify(dupes):''} ${orphans.length?'orphan labels '+JSON.stringify(orphans):''}`);
  }
  await p.close();
}
console.log(`\nid problems: ${total}`);
await br.close();
console.log(`\n${total===0?1:0} passed, ${total===0?0:1} failed`);
