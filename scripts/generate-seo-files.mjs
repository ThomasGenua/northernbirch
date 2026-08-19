// Writes robots.txt and sitemap.xml into dist/ after the Vite build.
//
// The canonical host is taken from Netlify's URL env var rather than hardcoded,
// so this stays correct if the domain changes and produces sensible output for
// deploy previews too.
import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = (process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://www.northernbirchcu.com').replace(/\/+$/, '');
const DIST = join(process.cwd(), 'dist');

// Single source: the ROUTES table in the app.
const app = readFileSync(join(process.cwd(), 'src/App.jsx'), 'utf8');
const block = app.slice(app.indexOf('const ROUTES={'), app.indexOf('const PATH_TO_PAGE'));
const paths = [...block.matchAll(/:"(\/[^"]*)"/g)].map((m) => m[1]);
if (paths.length < 20) throw new Error(`Only found ${paths.length} routes — did ROUTES move?`);

// Member-only and legal pages do not belong in a sitemap aimed at search.
const EXCLUDE = new Set(['/dashboard', '/messages', '/leadership']);
const urls = paths.filter((p) => !EXCLUDE.has(p));

const priority = (p) => (p === '/' ? '1.0' : ['/mortgages', '/accounts', '/cards', '/rates'].includes(p) ? '0.9' : '0.6');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><priority>${priority(p)}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /messages\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`SEO files written for ${SITE} (${urls.length} urls)`);
