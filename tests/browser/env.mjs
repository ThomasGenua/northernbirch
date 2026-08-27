// Shared environment for the browser suites.
//
// Everything here used to be hardcoded to one container: an absolute Chromium
// path, port 3118, /home/user/northernbirch. Resolve it instead so the suites
// run on any machine that has a Chromium and a built dist/.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DIST = join(ROOT, 'dist');
export const PORT = Number(process.env.PORT || 3118);
export const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;

const CANDIDATES = [
  process.env.CHROME_PATH,
  process.env.PLAYWRIGHT_BROWSERS_PATH && join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium', 'chrome-linux', 'chrome'),
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  '/opt/pw-browsers/chromium/chrome-linux/chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export const EXECUTABLE = CANDIDATES.find((p) => existsSync(p)) || null;
if (!EXECUTABLE) {
  console.error('No Chromium found. Set CHROME_PATH to a Chromium or Chrome binary.');
  process.exit(2);
}

// Every route the app serves. The suites walk this rather than each keeping
// their own copy, which drifted.
export const ROUTES = [
  '/', '/personal', '/accounts', '/mortgages', '/cards', '/insurance', '/advice', '/travel',
  '/business', '/digital', '/estate', '/community', '/contact', '/rates', '/quote',
  '/compare', '/claims', '/calculators', '/booking', '/referrals', '/blog', '/glossary',
  '/mobile-app', '/dashboard', '/ai-advisor', '/coverage-analyzer', '/financial-health-check',
  '/life-event-simulator', '/policy-document-reader', '/tax-optimizer', '/messages',
  '/privacy', '/accessibility', '/complaints', '/terms', '/leadership',
];

// Google Fonts is unreachable behind some proxies and adds ~30s per page to a
// networkidle wait. The suites do not test the fonts.
export const blockFonts = (ctx) => ctx.route('**fonts.g**', (r) => r.abort());

// Several suites assert against the app's own source -- that a rate in the
// schema is one the site publishes, that ROUTES and the test's route list
// agree. App.jsx was one file when they were written and is now a tree, so
// read all of it rather than naming a file that keeps moving.
export function appSource() {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(jsx?|mjs)$/.test(name)) out.push(readFileSync(p, 'utf8'));
    }
  };
  walk(join(ROOT, 'src'));
  return out.join('\n');
}
