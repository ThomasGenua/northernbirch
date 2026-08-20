// Post-build SEO generation: robots.txt, sitemap.xml, and a real HTML file per
// route.
//
// The app is client-rendered, so before this every URL served the same shell:
// one <title>, one description, whatever the homepage said. Googlebot runs JS
// and would eventually sort it out, but social and messaging scrapers do not
// run JS at all, so every shared link previewed as the homepage.
//
// Writing one file per route gives each URL its own title, description,
// canonical and Open Graph tags in the initial HTML. The body is still the
// SPA — this fixes what a non-JS client reads about the page, not what it can
// interact with.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE = (process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://www.northernbirchcu.com').replace(/\/+$/, '');
const DIST = join(process.cwd(), 'dist');
const app = readFileSync(join(process.cwd(), 'src/App.jsx'), 'utf8');

// --- routes, from the app's own ROUTES table ---
const routeBlock = app.slice(app.indexOf('const ROUTES={'), app.indexOf('const PATH_TO_PAGE'));
const routes = [...routeBlock.matchAll(/(\w+):"(\/[^"]*)"/g)].map((m) => ({ key: m[1], path: m[2] }));
if (routes.length < 20) throw new Error(`Only found ${routes.length} routes — did ROUTES move?`);

// --- per-page titles and descriptions, from the app's META table ---
const metaBlock = app.slice(app.indexOf('const META={'), app.indexOf('const META_DEFAULT'));
const META = {};
for (const m of metaBlock.matchAll(/(\w+):\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"\]/g)) {
  META[m[1]] = [m[2], m[3]].map((v) => v.replace(/\\"/g, '"'));
}
const defMatch = app.slice(app.indexOf('const META_DEFAULT')).match(/\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"\]/);
const META_DEFAULT = [defMatch[1], defMatch[2]];
if (Object.keys(META).length < 10) throw new Error('META table not parsed — did it move?');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const shell = readFileSync(join(DIST, 'index.html'), 'utf8');

function pageHtml(path, title, desc) {
  const url = SITE + (path === '/' ? '/' : path);
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(desc)}" />`)
    .replace('</head>', `  <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n  </head>`);
}

let written = 0;
for (const { key, path } of routes) {
  const [title, desc] = META[key] || META_DEFAULT;
  const html = pageHtml(path, title, desc);
  if (path === '/') { writeFileSync(join(DIST, 'index.html'), html); }
  else {
    const dir = join(DIST, path.slice(1));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
  }
  written++;
}

// --- robots.txt and sitemap.xml ---
const EXCLUDE = new Set(['/dashboard', '/messages', '/leadership']);
const urls = routes.map((r) => r.path).filter((p) => !EXCLUDE.has(p));
const priority = (p) => (p === '/' ? '1.0' : ['/mortgages', '/accounts', '/cards', '/rates'].includes(p) ? '0.9' : '0.6');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><priority>${priority(p)}</priority></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /messages\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`SEO files written for ${SITE} (${written} route pages, ${urls.length} sitemap urls)`);
