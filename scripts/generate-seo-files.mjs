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

const shell = readFileSync(join(DIST, 'index.html'), 'utf8');

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
  .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

function pageHtml(path, title, desc) {
  const url = SITE + (path === '/' ? '/' : path);
  return stripInjected(shell)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(desc)}" />`)
    // og:image and the JSON-LD both need absolute URLs, and social crawlers do
    // not run JS, so they have to be written into every prerendered page here.
    .replace('</head>', [
      `  <link rel="canonical" href="${url}" />`,
      `    <meta property="og:url" content="${url}" />`,
      `    <meta property="og:image" content="${SITE}/og-image.png" />`,
      `    <meta property="og:image:width" content="1200" />`,
      `    <meta property="og:image:height" content="630" />`,
      `    <meta property="og:image:alt" content="Northern Birch Credit Union" />`,
      `    <meta name="twitter:image" content="${SITE}/og-image.png" />`,
      `    <script type="application/ld+json">${JSON.stringify(orgSchema(SITE))}</script>`,
      '  </head>',
    ].join('\n'));
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
