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
  let p=join(DIST,url);
  if(existsSync(p)&&statSync(p).isDirectory()){                 // Netlify serves <dir>/index.html
    const idx=join(p,'index.html');
    p=existsSync(idx)?idx:join(DIST,'index.html');
  } else if(!existsSync(p)) p=join(DIST,'index.html');           // SPA fallback
  res.writeHead(200,{'Content-Type':TYPES[extname(p)]||'application/octet-stream',...H});
  res.end(readFileSync(p));
}).listen(PORT,()=>console.log('static server on '+PORT));
