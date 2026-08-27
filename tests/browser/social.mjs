import { DIST, appSource } from './env.mjs';

import { readFileSync, existsSync, statSync } from 'node:fs';
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const src=appSource();
const paths=[...src.match(/const ROUTES=\{([\s\S]*?)\n\};/)[1].matchAll(/"?[a-zA-Z-]+"?\s*:\s*"([^"]+)"/g)].map(m=>m[1]);

// the image itself
const img=`${DIST}/og-image.png`;
check(existsSync(img),'og-image.png is in the build');
const size=existsSync(img)?statSync(img).size:0;
check(size>0&&size<8*1024*1024,`og-image is ${Math.round(size/1024)}KB (under the 8MB platforms accept)`);
const buf=existsSync(img)?readFileSync(img):Buffer.alloc(0);
check(buf.slice(0,8).toString('hex')==='89504e470d0a1a0a','og-image is a real PNG');
const w=buf.readUInt32BE(16), h=buf.readUInt32BE(20);
check(w===1200&&h===630,`og-image is ${w}x${h} (1.91:1, what the platforms want)`);

let bad=[];
for(const path of paths){
  const f=path==='/'?`${DIST}/index.html`:`${DIST}${path}/index.html`;
  const html=readFileSync(f,'utf8');
  const ogimg=(html.match(/<meta property="og:image" content="([^"]*)"/)||[])[1];
  const twimg=(html.match(/<meta name="twitter:image" content="([^"]*)"/)||[])[1];
  const card=(html.match(/<meta name="twitter:card" content="([^"]*)"/)||[])[1];
  const ld=(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)||[])[1];
  const problems=[];
  if(!ogimg||!/^https:\/\//.test(ogimg))problems.push('og:image not absolute');
  if(!twimg)problems.push('no twitter:image');
  if(card==='summary_large_image'&&!ogimg)problems.push('large-image card with no image');
  if(!ld)problems.push('no JSON-LD');
  else { try{ const o=JSON.parse(ld); if(o['@type']!=='BankOrCreditUnion')problems.push('wrong @type'); }catch(e){ problems.push('JSON-LD does not parse'); } }
  if(problems.length)bad.push(`${path}: ${problems.join(', ')}`);
}
check(bad.length===0,`all ${paths.length} pages carry an absolute og:image, twitter:image and valid JSON-LD${bad.length?': '+JSON.stringify(bad.slice(0,3)):''}`);

// the structured data must only restate what the site publishes
const ld=JSON.parse(readFileSync(`${DIST}/index.html`,'utf8').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
check(ld.department.length===3,`3 open branches described (${ld.department.length})`);
check(!JSON.stringify(ld).includes('KESKUS'),'the unopened KESKUS branch is not asserted');
check(!JSON.stringify(ld).includes('TBD')&&!JSON.stringify(ld).includes('Coming Soon'),'no placeholder values leaked into the schema');
for(const d of ld.department){
  const phone=d.telephone.replace(/\D/g,'').slice(-10);
  check(src.includes(phone.replace(/^(\d{3})(\d{3})(\d{4})$/,'$1-$2-$3')),`${d.name.split('— ')[1]}: phone ${d.telephone} appears on the site`);
}
check(ld.address.postalCode==='M4A 2N8'&&src.includes('M4A 2N8'),'HQ postal code matches the privacy policy');
console.log(`\n${pass} passed, ${fail} failed`);
