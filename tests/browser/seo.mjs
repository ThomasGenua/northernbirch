import { DIST, ROOT, appSource } from './env.mjs';

import { readFileSync, existsSync } from 'node:fs';
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const src=appSource();
const routes=Object.fromEntries([...src.match(/const ROUTES=\{([\s\S]*?)\n\};/)[1].matchAll(/"?([a-zA-Z-]+)"?\s*:\s*"([^"]+)"/g)].map(m=>[m[1],m[2]]));
const paths=Object.values(routes);
const titles=new Map(), descs=new Map();
for(const path of paths){
  const f=path==='/'?`${DIST}/index.html`:`${DIST}${path}/index.html`;
  if(!existsSync(f)){ check(false,`${path}: no prerendered file`); continue }
  const h=readFileSync(f,'utf8');
  const title=(h.match(/<title>([^<]*)<\/title>/)||[])[1]||'';
  const desc=(h.match(/<meta name="description" content="([^"]*)"/)||[])[1]||'';
  const canon=(h.match(/<link rel="canonical" href="([^"]*)"/)||[])[1]||'';
  const ogt=(h.match(/<meta property="og:title" content="([^"]*)"/)||[])[1]||'';
  const ogu=(h.match(/<meta property="og:url" content="([^"]*)"/)||[])[1]||'';
  const ok=title&&desc&&canon&&ogt&&ogu;
  if(!ok) check(false,`${path}: missing ${[!title&&'title',!desc&&'description',!canon&&'canonical',!ogt&&'og:title',!ogu&&'og:url'].filter(Boolean).join(', ')}`);
  else {
    const cOk=canon.endsWith(path==='/'?'/':path)||canon.endsWith(path+'/');
    if(!cOk) check(false,`${path}: canonical points at ${canon}`);
    titles.set(path,title); descs.set(path,desc);
  }
}
check(titles.size===paths.length,`all ${paths.length} routes prerendered with full meta (${titles.size})`);
const dupT=[...titles.values()].length-new Set(titles.values()).size;
const dupD=[...descs.values()].length-new Set(descs.values()).size;
check(dupT===0,`every route has a unique <title> (${dupT} duplicates)`);
check(dupD===0,`every route has a unique description (${dupD} duplicates)`);
check([...titles.values()].every(t=>t.length<=70),`titles within 70 chars (worst ${Math.max(...[...titles.values()].map(t=>t.length))})`);
check([...descs.values()].every(d=>d.length>=70&&d.length<=200),`descriptions 70-200 chars (range ${Math.min(...[...descs.values()].map(d=>d.length))}-${Math.max(...[...descs.values()].map(d=>d.length))})`);
// robots + sitemap
const rb=existsSync(`${DIST}/robots.txt`)?readFileSync(`${DIST}/robots.txt`,'utf8'):'';
check(/Sitemap:\s*https?:\/\//i.test(rb),'robots.txt points at the sitemap');
const sm=existsSync(`${DIST}/sitemap.xml`)?readFileSync(`${DIST}/sitemap.xml`,'utf8'):'';
const locs=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
check(locs.length>0,`sitemap lists ${locs.length} urls`);
const sitemapPaths=new Set(locs.map(u=>new URL(u).pathname.replace(/\/$/,'')||'/'));
const missing=paths.filter(p=>!sitemapPaths.has(p));
// the member-only and legal-ish pages are reasonable to leave out; report either way
console.log('   routes not in sitemap:',JSON.stringify(missing));
check(sitemapPaths.has('/')&&sitemapPaths.has('/mortgages')&&sitemapPaths.has('/accounts')&&sitemapPaths.has('/cards'),'the core banking pages are all in the sitemap');
check(!/<loc>[^<]*\/dashboard/.test(sm)&&!/<loc>[^<]*\/messages/.test(sm),'member-only pages are kept out of the sitemap');
// keeping a URL out of the index needs noindex, and noindex needs the page to
// stay crawlable -- a Disallow would stop the crawler ever reading it
{
  const EX=['/dashboard','/messages','/leadership'];
  for(const path of EX){
    const h=readFileSync(`${DIST}${path}/index.html`,'utf8');
    check(/<meta name="robots" content="noindex, nofollow"/.test(h),`${path} carries noindex`);
    check((h.match(/<meta name="robots"/g)||[]).length===1,`${path} carries exactly one robots meta`);
  }
  for(const path of ['/','/mortgages','/privacy','/rates']){
    const f=path==='/'?`${DIST}/index.html`:`${DIST}${path}/index.html`;
    check(!/<meta name="robots"/.test(readFileSync(f,'utf8')),`${path} is left indexable`);
  }
  check(!/Disallow:/.test(rb),'robots.txt does not Disallow the noindexed pages (it would hide the directive)');
  check(EX.every(p=>!sitemapPaths.has(p)),'all three stay out of the sitemap too');
}
// the generator writes over the file it reads its shell from, so running it
// without a rebuild used to append a second canonical/og:image/ld+json block
{
  const { execSync } = await import('node:child_process');
  execSync('node scripts/generate-seo-files.mjs', {cwd:ROOT, stdio:'ignore'});
  execSync('node scripts/generate-seo-files.mjs', {cwd:ROOT, stdio:'ignore'});
  const h=readFileSync(`${DIST}/index.html`,'utf8');
  const n=(re)=>(h.match(re)||[]).length;
  check(n(/rel="canonical"/g)===1&&n(/property="og:url"/g)===1&&n(/property="og:image"/g)===1&&n(/application\/ld\+json/g)===1,
    `generator is idempotent: canonical=${n(/rel="canonical"/g)} og:url=${n(/property="og:url"/g)} og:image=${n(/property="og:image"/g)} ld+json=${n(/application\/ld\+json/g)}`);
}
console.log(`\n${pass} passed, ${fail} failed`);
