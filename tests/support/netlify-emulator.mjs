// A stand-in for Netlify, for tests only. It is NOT Netlify.
//
// What it does: serves dist/ the way netlify.toml says (pretty URLs, a real 404
// for an unknown path, the toml's headers), and puts the REAL handlers in front
// of it in the order Netlify runs them -- the password-gate edge function on
// every path, then /api/chat and /api/demo-intake -- behind a real HTTP server,
// so cookies, redirects and status codes travel over a socket instead of being
// passed between functions in one process.
//
// What it does not do: run on Netlify's runtime, set Netlify's own request
// headers, read Netlify's environment, bundle the functions, or talk to
// Anthropic. The upstream call is replaced by a stub that records what it was
// sent (never the key). A pass here says the pieces fit together; it does not
// say the deployed site works.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

function tomlHeaders() {
  const toml = readFileSync(join(ROOT, 'netlify.toml'), 'utf8');
  const block = toml.slice(toml.indexOf('[headers.values]'));
  const h = {};
  for (const l of block.split('\n').slice(1)) { const m = l.match(/^\s*([A-Za-z-]+)\s*=\s*"(.*)"\s*$/); if (m) h[m[1]] = m[2]; }
  return h;
}

/**
 * @param {{ sitePassword?: string|null, apiKey?: string|null, upstream?: (body:object)=>({status:number, body:object}) }} opts
 * @returns {Promise<{ url:string, close:()=>Promise<void>, upstreamCalls:object[], setUpstream:(f:Function)=>void, resetThrottle:()=>void }>}
 */
export async function startEmulator(opts = {}) {
  const env = { SITE_PASSWORD: opts.sitePassword ?? null, ANTHROPIC_API_KEY: opts.apiKey ?? 'sk-emulator-not-a-real-key' };
  const prevNetlify = globalThis.Netlify;   // the handlers read this global, so emulators must nest: restore it on close
  globalThis.Netlify = { env: { get: (k) => env[k] ?? undefined } };

  const upstreamCalls = [];
  let upstream = opts.upstream || (() => ({ status: 200, body: { content: [{ type: 'text', text: 'Stub reply from the emulator.' }], stop_reason: 'end_turn' } }));
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (String(url).startsWith('https://api.anthropic.com/')) {
      const body = JSON.parse(init.body);
      upstreamCalls.push({ url: String(url), model: body.model, max_tokens: body.max_tokens, roles: body.messages.map((m) => m.role), firstUser: body.messages.find((m) => m.role === 'user')?.content, hasKeyHeader: Boolean(init.headers?.['x-api-key']) });
      const r = upstream(body);
      return new Response(JSON.stringify(r.body), { status: r.status, headers: { 'content-type': 'application/json' } });
    }
    return realFetch(url, init);
  };

  // a fresh copy of each module per emulator, so the lockout counter and rate
  // limiter start empty and the env above is the one they read
  const q = `?e=${Math.random().toString(36).slice(2)}`;
  const mod = (p) => import(pathToFileURL(join(ROOT, p)).href + q);
  const gate = await mod('netlify/edge-functions/password-gate.js');
  const chat = await mod('netlify/functions/chat.mjs');
  const intake = await mod('netlify/functions/demo-intake.mjs');
  const H = tomlHeaders();

  const serveStatic = (pathname) => {
    const DIST = join(ROOT, 'dist');
    let p = join(DIST, decodeURIComponent(pathname)), code = 200;
    if (existsSync(p) && statSync(p).isDirectory()) { const idx = join(p, 'index.html'); if (existsSync(idx)) p = idx; else { p = join(DIST, '404.html'); code = 404; } }
    else if (!existsSync(p)) { p = join(DIST, '404.html'); code = 404; }
    return new Response(readFileSync(p), { status: code, headers: { 'Content-Type': TYPES[extname(p)] || 'application/octet-stream', ...H } });
  };

  const server = createServer(async (req, res) => {
    try {
      const chunks = []; for await (const c of req) chunks.push(c);
      const origin = `http://${req.headers.host}`;
      const request = new Request(origin + req.url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const pathname = new URL(request.url).pathname;
      // Netlify order: the edge function sits in front of everything; context.next() reaches the function or the file
      const context = { ip: req.socket.remoteAddress, next: async () => {
        if (pathname === '/api/chat') return chat.default(request);
        if (pathname === '/api/demo-intake') return intake.default(request);
        return serveStatic(pathname);
      } };
      const response = await gate.default(request, context);
      const headers = {}; response.headers.forEach((v, k) => { headers[k] = v; });
      const cookies = response.headers.getSetCookie?.() || [];
      if (cookies.length) headers['set-cookie'] = cookies;
      res.writeHead(response.status, headers);
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (e) { res.writeHead(500, { 'content-type': 'text/plain' }); res.end('emulator error: ' + e.message); }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  return {
    url: `http://localhost:${port}`,
    upstreamCalls,
    setUpstream: (f) => { upstream = f; },
    resetThrottle: () => gate.resetThrottle?.(),
    close: () => new Promise((r) => { globalThis.fetch = realFetch; globalThis.Netlify = prevNetlify; server.close(() => r()); }),
  };
}
