import { DIST, PORT, ROOT } from './env.mjs';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
const toml = readFileSync(join(ROOT,'netlify.toml'),'utf8');
const block = toml.slice(toml.indexOf('[headers.values]'));
const H = {};
for (const l of block.split('\n').slice(1)) { const m = l.match(/^\s*([A-Za-z-]+)\s*=\s*"(.*)"\s*$/); if (m) H[m[1]] = m[2]; }
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
createServer((req,res)=>{
  const url=decodeURIComponent(req.url.split('?')[0]);
  let p=join(DIST,url), code=200;
  if(existsSync(p)&&statSync(p).isDirectory()){                 // Netlify serves <dir>/index.html
    const idx=join(p,'index.html');
    if(existsSync(idx)) p=idx; else { p=join(DIST,'404.html'); code=404 }
  } else if(!existsSync(p)){
    // netlify.toml has no catch-all: a path matching no file gets 404.html
    // with a 404 status. Mirrored here so the suites test the behaviour the
    // deployed site actually has -- this server used to serve index.html with
    // a 200 for anything it could not find, which is the soft 404 that was
    // being fixed, reproduced in the harness meant to catch it.
    p=join(DIST,'404.html'); code=404;
  }
  if(!existsSync(p)){ res.writeHead(404,{'Content-Type':'text/plain',...H}); res.end('404'); return }
  res.writeHead(code,{'Content-Type':TYPES[extname(p)]||'application/octet-stream',...H});
  res.end(readFileSync(p));
}).listen(PORT,()=>console.log('static server on '+PORT));
