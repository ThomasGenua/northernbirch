import { ROOT } from './env.mjs';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
let pass=0,fail=0; const check=(c,m)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+m)};
const toml=readFileSync(join(ROOT,'netlify.toml'),'utf8');
const block=toml.slice(toml.indexOf('[headers.values]'));
const H={};
for(const l of block.split('\n').slice(1)){const m=l.match(/^\s*([A-Za-z-]+)\s*=\s*"(.*)"\s*$/);if(m)H[m[1]]=m[2]}
console.log('headers declared:',Object.keys(H).join(', '),'\n');
check(/max-age=\d+/.test(H['Strict-Transport-Security']||''),`HSTS: ${H['Strict-Transport-Security']}`);
check((H['X-Content-Type-Options']||'')==='nosniff','X-Content-Type-Options: nosniff');
check(/DENY|SAMEORIGIN/.test(H['X-Frame-Options']||''),`X-Frame-Options: ${H['X-Frame-Options']}`);
check(/no-referrer|strict-origin/.test(H['Referrer-Policy']||''),`Referrer-Policy: ${H['Referrer-Policy']}`);
const csp=H['Content-Security-Policy']||'';
check(!!csp,'a CSP is set');
check(/default-src\s+'self'/.test(csp),"default-src 'self'");
check(!/script-src[^;]*'unsafe-inline'/.test(csp),"script-src does NOT allow 'unsafe-inline'");
check(!/script-src[^;]*'unsafe-eval'/.test(csp),"script-src does NOT allow 'unsafe-eval'");
check(/object-src\s+'none'/.test(csp),"object-src 'none'");
check(/frame-ancestors\s+'none'/.test(csp),"frame-ancestors 'none'");
check(/base-uri\s+'self'|base-uri\s+'none'/.test(csp),'base-uri is restricted');
check(/form-action/.test(csp),'form-action is set');
const styleInline=/style-src[^;]*'unsafe-inline'/.test(csp);
console.log(`   note: style-src ${styleInline?"allows 'unsafe-inline' (the app is built on inline style={{}})":"is strict"}`);
// permissions policy
check(/camera=\(\)|geolocation=\(\)/.test(H['Permissions-Policy']||''),`Permissions-Policy: ${(H['Permissions-Policy']||'(none)').slice(0,60)}`);
console.log(`\n${pass} passed, ${fail} failed`);
