// Post-build SEO generation: robots.txt, sitemap.xml, and a real HTML file per
// route.
//
// The app is client-rendered, so before this every URL served the same shell:
// one <title>, one description, whatever the homepage said. Googlebot runs JS
// and would eventually sort it out, but social and messaging scrapers do not
// run JS at all, so every shared link previewed as the homepage.
//
// Writing one file per route gives each URL its own title, description,
// canonical and Open Graph tags in the initial HTML -- and, since the
// prerender step below, the page's actual content. Anything that does not run
// JavaScript now reads the page rather than an empty div, and a member on a
// slow connection sees it while the 340KB bundle is still arriving.
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = (process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://www.northernbirchcu.com').replace(/\/+$/, '');
const DIST = join(process.cwd(), 'dist');
// ROUTES and META moved to src/ui.jsx when the shared layer was split out of
// App.jsx, and this script threw rather than silently emitting default meta on
// every page. Read both, so it keeps working wherever the tables end up.
const app = ['src/ui.jsx', 'src/App.jsx']
  .map((f) => { try { return readFileSync(join(process.cwd(), f), 'utf8'); } catch { return ''; } })
  .join('\n');

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

// The 404 page's title and description live outside META, because META is
// checked route-by-route against ROUTES and this page has no route.
const nfMatch = app.slice(app.indexOf('const META_NOTFOUND')).match(/\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"\]/);
if (!nfMatch) throw new Error('META_NOTFOUND not parsed — did it move?');
const META_NOTFOUND = [nfMatch[1], nfMatch[2]].map((v) => v.replace(/\\"/g, '"'));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Structured data for the credit union and its open branches. Every value here
// is already published on the site (the contact page and the privacy policy);
// nothing is invented. KESKUS is left out on purpose: it has no street number,
// no phone and no hours yet, and asserting any of those to a search engine
// would be a claim the site itself does not make.
function orgSchema(site) {
  const branch = (name, street, locality, postalCode, phone, hours) => ({
    '@type': 'BankOrCreditUnion',
    name: `Northern Birch Credit Union \u2014 ${name}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: locality,
      addressRegion: 'ON',
      addressCountry: 'CA',
      ...(postalCode ? { postalCode } : {}),
    },
    telephone: phone,
    openingHours: hours,
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BankOrCreditUnion',
    name: 'Northern Birch Credit Union',
    legalName: 'Northern Birch Credit Union Limited',
    url: site + '/',
    logo: site + '/og-image.png',
    image: site + '/og-image.png',
    telephone: '+1-416-465-4659',
    email: 'FinancialCheckup@northernbirchcu.com',
    areaServed: 'Ontario, Canada',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Credit Union Drive',
      addressLocality: 'North York',
      addressRegion: 'ON',
      postalCode: 'M4A 2N8',
      addressCountry: 'CA',
    },
    department: [
      branch('Latvian Centre', '4 Credit Union Drive', 'North York', 'M4A 2N8', '+1-416-465-4659',
        ['Mo-We 10:00-15:00', 'Th 10:00-19:00', 'Fr 10:00-15:00', 'Sa 09:00-13:00']),
      branch('Tartu College', '310 Bloor Street West', 'Toronto', '', '+1-416-922-2551',
        ['Mo-Fr 10:00-15:00']),
      branch('Hamilton', '16 Queen Street North', 'Hamilton', '', '+1-905-527-4344',
        ['Tu-We 10:00-15:00', 'Th 10:00-19:00', 'Fr 10:00-15:00']),
    ],
  };
}

// Kept out of the sitemap, and kept out of the index. /dashboard and
// /messages are member views; /leadership is the internal business case,
// addressed to the board and carrying five-year revenue projections, the cost
// to NBCU and partnership terms. Someone already decided none of these should
// be promoted -- that decision just stopped at the sitemap.
const EXCLUDE = new Set(['/dashboard', '/messages', '/leadership']);

// This script writes its output back over dist/index.html, which is also where
// it reads the shell from -- so a second run reads a shell that already has the
// homepage rendered into it. stripInjected below handles the meta that caused,
// but not the body: the `<div id="root"></div>` that pageHtml looks for was no
// longer empty, the replace silently did nothing, and every page came out
// carrying the homepage's markup under its own title. tests/browser/seo.mjs
// runs this script twice on purpose, so in practice every suite that ran after
// it was testing 37 copies of the homepage.
//
// Empty the root before using it as a shell. The closing tag is found by
// counting depth rather than by regex, because the rendered body is hundreds
// of nested divs and the first </div> is not the right one.
const emptyRoot = (html) => {
  const open = '<div id="root">';
  const i = html.indexOf(open);
  if (i < 0) return html;
  const tag = /<(\/?)div\b/g;
  tag.lastIndex = i + open.length;
  let depth = 1;
  for (let m; (m = tag.exec(html));) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(0, i) + open + '</div>' + html.slice(m.index + '</div>'.length);
  }
  return html;
};

const shell = emptyRoot(readFileSync(join(DIST, 'index.html'), 'utf8'));

// The server build (npm run build:ssr) writes dist-ssr/entry-server.js. If it
// is missing -- someone ran vite build on its own -- every page still gets its
// meta, just no body, which is exactly what this script did before.
const SSR_ENTRY = join(process.cwd(), 'dist-ssr', 'entry-server.js');
let renderRoute = null;
if (existsSync(SSR_ENTRY)) {
  ({ render: renderRoute } = await import(pathToFileURL(SSR_ENTRY).href));
} else {
  console.warn('dist-ssr/entry-server.js not found -- writing meta-only pages');
}

// A route that throws is a bug worth failing the build over: shipping an empty
// div for one page while the other 36 carry content is the kind of thing that
// goes unnoticed for months.
const prerendered = new Map();
if (renderRoute) {
  for (const { path } of routes) {
    try { prerendered.set(path, await renderRoute(path)); }
    catch (e) { throw new Error(`prerendering ${path} failed: ${e && e.stack || e}`); }
  }
}

// The generator writes its output back over dist/index.html, which is also
// where it reads the shell from. A normal `npm run build` is safe because vite
// regenerates dist first, but running this script on its own appended a second
// canonical, og:image and ld+json block every time. Two canonicals is worse
// than none, so strip anything a previous run injected before injecting again.
const stripInjected = (html) => html
  .replace(/\s*<link rel="canonical"[^>]*>/g, '')
  .replace(/\s*<meta property="og:url"[^>]*>/g, '')
  .replace(/\s*<meta property="og:image(?::(?:width|height|alt))?"[^>]*>/g, '')
  .replace(/\s*<meta name="twitter:image"[^>]*>/g, '')
  .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
  .replace(/\s*<meta name="robots"[^>]*>/g, '');

function pageHtml(path, title, desc, opts = {}) {
  const url = SITE + (path === '/' ? '/' : path);
  const body = 'body' in opts ? opts.body : prerendered.get(path);
  // The 404 file answers every unmatched URL, so it names no canonical and no
  // og:url: either would be a claim that some one specific page is the page
  // the visitor asked for, which is the soft-404 problem it exists to end.
  const addressed = opts.canonical !== false;
  const robots = opts.robots || (EXCLUDE.has(path) ? 'noindex, nofollow' : null);
  return stripInjected(shell)
    // React hydrates this markup rather than replacing it, so the member keeps
    // looking at the same pixels instead of watching the page blank and redraw.
    .replace('<div id="root"></div>', body ? `<div id="root">${body}</div>` : '<div id="root"></div>')
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(desc)}" />`)
    // og:image and the JSON-LD both need absolute URLs, and social crawlers do
    // not run JS, so they have to be written into every prerendered page here.
    .replace('</head>', [
      ...(addressed ? [
        `  <link rel="canonical" href="${url}" />`,
        `    <meta property="og:url" content="${url}" />`,
      ] : []),
      `    <meta property="og:image" content="${SITE}/og-image.png" />`,
      `    <meta property="og:image:width" content="1200" />`,
      `    <meta property="og:image:height" content="630" />`,
      `    <meta property="og:image:alt" content="Northern Birch Credit Union" />`,
      `    <meta name="twitter:image" content="${SITE}/og-image.png" />`,
      `    <script type="application/ld+json">${JSON.stringify(orgSchema(SITE))}</script>`,
      ...(robots ? [`    <meta name="robots" content="${robots}" />`] : []),
      '  </head>',
    ].join('\n').replace(/^\s+/, '  '));
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

// --- 404 ---
// Netlify serves dist/404.html, with a real 404 status, for any path that
// matches no file. That only became possible when prerendering gave every
// route its own file: until then netlify.toml needed a catch-all to
// index.html so client-side routes survived a refresh, and that catch-all
// also answered every unknown URL with the homepage under a 200.
//
// Rendered from a path that is deliberately not in ROUTES, which is what
// makes pageFromPath fall through to the 404 page.
const NOT_FOUND_PATH = '/__not-found__';
if (routes.some((r) => r.path === NOT_FOUND_PATH)) throw new Error(`${NOT_FOUND_PATH} is a real route -- pick another sentinel for the 404 render`);
let notFoundBody;
if (renderRoute) {
  try { notFoundBody = await renderRoute(NOT_FOUND_PATH); }
  catch (e) { throw new Error(`prerendering the 404 page failed: ${e && e.stack || e}`); }
}
writeFileSync(join(DIST, '404.html'), pageHtml(NOT_FOUND_PATH, META_NOTFOUND[0], META_NOTFOUND[1], {
  body: notFoundBody, canonical: false, robots: 'noindex, follow',
}));

// --- robots.txt and sitemap.xml ---
const urls = routes.map((r) => r.path).filter((p) => !EXCLUDE.has(p));
const priority = (p) => (p === '/' ? '1.0' : ['/mortgages', '/accounts', '/cards', '/rates'].includes(p) ? '0.9' : '0.6');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><priority>${priority(p)}</priority></url>`).join('\n')}
</urlset>
`);
// No Disallow here on purpose: a disallowed URL is never fetched, so the
// crawler never reads its noindex and the URL can still be indexed from an
// inbound link. Letting these pages be crawled is what makes their noindex
// effective.
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`SEO files written for ${SITE} (${prerendered.size} prerendered, ${written} route pages, 404.html, ${urls.length} sitemap urls)`);
