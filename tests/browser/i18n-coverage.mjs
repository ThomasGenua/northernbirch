// Does Estonian/Latvian mode actually translate the pages that claim to be?
//
// scripts/check-i18n.mjs reads the source, so it sees t("literal") but not a
// key held in a variable -- the nav, the product cards, the card benefits. A
// review of Estonian mode found 91 strings still in English on those pages.
// t() now records each string it fails to translate (window.__nbMisses); this
// loads every page listed in TRANSLATED_PAGES in both languages, scrolls it so
// lazy sections render, and fails on anything recorded.
//
// It cannot judge the quality of a translation, only that one exists. The
// strings are unreviewed by a native speaker (the "reviewed" field in
// content/i18n/*.json says so).
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const ui = readFileSync(new URL('../../src/ui.jsx', import.meta.url), 'utf8');
const pages = [...ui.match(/TRANSLATED_PAGES=new Set\(\[([^\]]*)\]\)/)[1].matchAll(/"(\w+)"/g)].map((m) => m[1]);
const routes = Object.fromEntries([...ui.match(/export const ROUTES=\{([\s\S]*?)\};/)[1].matchAll(/(\w+):"([^"]+)"/g)].map((m) => [m[1], m[2]]));

const br = await chromium.launch({ executablePath: EXECUTABLE });
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

check(pages.length >= 6, `${pages.length} pages are declared translated: ${pages.join(', ')}`);

for (const [code, tag, name] of [['est', 'et', 'Estonian'], ['lat', 'lv', 'Latvian']]) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await blockFonts(ctx);
  await ctx.addInitScript(([l]) => { try { localStorage.setItem('nb-lang', l); localStorage.setItem('nb-cookie-pref', 'essential'); } catch { /* storage blocked */ } }, [code]);
  const p = await ctx.newPage();
  for (const key of pages) {
    const route = routes[key];
    await p.goto(BASE + route, { waitUntil: 'load' });
    await p.waitForTimeout(900);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
    await p.waitForTimeout(250);
    const info = await p.evaluate(() => ({ misses: [...(window.__nbMisses || [])], htmlLang: document.documentElement.lang, mainLang: document.querySelector('main')?.getAttribute('lang') }));
    check(info.misses.length === 0, `${name} ${route}: every string is translated${info.misses.length ? ' -- missing: ' + JSON.stringify(info.misses.slice(0, 4)) : ''}`);
    check(info.htmlLang === tag && info.mainLang === null, `${name} ${route}: <html lang="${info.htmlLang}"> and the body is not marked English (main lang=${info.mainLang})`);
  }
  // the header, footer, search box and notifications are on every page
  await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(700);
  await p.locator('button[aria-label="Search Northern Birch"]').first().click().catch(() => {}); await p.waitForTimeout(300); await p.keyboard.press('Escape');
  const chrome = await p.evaluate(() => [...(window.__nbMisses || [])]);
  check(chrome.length === 0, `${name}: the header, footer and menus are translated${chrome.length ? ' -- missing: ' + JSON.stringify(chrome.slice(0, 4)) : ''}`);
  await ctx.close();
}

// ---------- a translation must not say something the English no longer does ----------
{
  const stale = /pakkumi|hinnapakk|piedāvājum|cenu aprēķin|quote/i;
  for (const code of ['et', 'lv']) {
    const strings = JSON.parse(readFileSync(new URL(`../../content/i18n/${code}.json`, import.meta.url), 'utf8')).strings;
    const bad = Object.entries(strings).filter(([k, v]) => stale.test(v) && !/offer|quote/i.test(k)).map(([k]) => k);
    check(bad.length === 0, `${code}.json: no translation still means "quote" or "offer" where the English says something else${bad.length ? ': ' + JSON.stringify(bad.slice(0, 3)) : ''}`);
  }
  const en = JSON.parse(readFileSync(new URL('../../content/i18n/et.json', import.meta.url), 'utf8')).strings['Talk to an advisor'];
  check(/nõustaja/i.test(en) && !/pakkumi/i.test(en), `"Talk to an advisor" means talk to an advisor in Estonian (${en})`);
}

console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
