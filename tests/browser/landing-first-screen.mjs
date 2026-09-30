// What a first-time visitor sees before they scroll.
//
// A review of the landing page found three things the other suites could not
// see, because they measure what exists rather than what a person can use:
//   - on a phone the menu button was navy on the navy hero: present in the DOM,
//     invisible on screen, and "Try the demo" lives inside that menu;
//   - the 163px cookie bar covered all four hero buttons, and the round chat
//     button sat on top of the hero paragraph;
//   - the outlined hero button was #1F6FA5 on navy, about 2.8:1.
// So this measures the first screen as rendered: geometry and colour, at the
// sizes people actually use, with the cookie bar up (it is up for every new
// visitor).
import { chromium } from 'playwright-core';
import { BASE, EXECUTABLE, blockFonts } from './env.mjs';

const br = await chromium.launch({ executablePath: EXECUTABLE });
let pass = 0, fail = 0;
const check = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m); };

const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
const rgb = (s) => (s.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
// The hero is a gradient from #0C1829 through #1B2A4A to #1e4060: text has to
// clear 4.5:1 against the LIGHTEST stop, which is the worst case.
const HERO_LIGHTEST = [0x1e, 0x40, 0x60];
const CREAM = [253, 251, 247];

async function open(viewport, mobile) {
  const ctx = await br.newContext({ viewport, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
  await blockFonts(ctx);
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'load' });
  await p.waitForTimeout(1100);   // the cookie bar is up: this is a first visit
  return { ctx, p };
}

const geometry = (p) => p.evaluate(() => {
  const rect = (e) => { const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right }; };
  // only the hero's own buttons: the product cards below also say "Explore Mortgages"
  const hero = document.querySelector('main section');
  const ctas = [...hero.querySelectorAll('button')].filter((b) => /^(Compare Accounts|Explore Mortgages|Apply for a Credit Card|Ask about insurance)$/.test(b.innerText.trim()));
  const bar = [...document.querySelectorAll('[role="region"]')].find((e) => e.getAttribute('aria-label') === 'Cookie preferences');
  const launcher = document.querySelector('[aria-label="Open the Northern Birch AI assistant"]');
  const badge = [...hero.querySelectorAll('span')].find((s) => /full-service credit union since/i.test(s.textContent));
  return {
    vh: innerHeight,
    ctas: ctas.map((b) => ({ label: b.innerText.trim(), ...rect(b) })),
    bar: bar ? rect(bar) : null,
    launcher: launcher ? rect(launcher) : null,
    emptyAboveBadge: badge.getBoundingClientRect().top - hero.getBoundingClientRect().top,
  };
});
// Overlap of more than a few pixels: the paragraph's box is a rectangle but its
// last line is short, so a 3px touch is not text being covered.
const overlap = (a, b, slack = 8) => a.left < b.right - slack && a.right > b.left + slack && a.top < b.bottom - slack && a.bottom > b.top + slack;

// ---------- phones ----------
for (const [label, vp] of [['iPhone 14 (390x844)', { width: 390, height: 844 }], ['iPhone SE (375x667)', { width: 375, height: 667 }]]) {
  const { ctx, p } = await open(vp, true);
  const g = await geometry(p);

  const menu = p.locator('button[aria-label="Open menu"]');
  const colour = rgb(await menu.evaluate((e) => getComputedStyle(e).color));
  // at the top of the home page the header is transparent over the dark hero
  const navBg = await p.evaluate(() => getComputedStyle(document.querySelector('nav')).backgroundColor);
  const transparent = /rgba\(0, 0, 0, 0\)|transparent/.test(navBg);
  check(transparent, `${label}: at the top of the page the header is transparent over the hero (${navBg})`);
  check(ratio(colour, HERO_LIGHTEST) >= 4.5, `${label}: the menu icon is readable on the hero (${ratio(colour, HERO_LIGHTEST).toFixed(1)}:1, needs 4.5)`);

  const bh = g.bar ? g.bar.bottom - g.bar.top : 0;
  check(bh > 0 && bh <= (vp.height < 700 ? 150 : 140), `${label}: the cookie bar takes at most ~140px, not a fifth of the screen (${Math.round(bh)}px)`);
  const hidden = g.ctas.filter((c) => c.bottom > g.bar.top);
  check(g.ctas.length === 4 && hidden.length === 0, `${label}: all four hero buttons are above the cookie bar${hidden.length ? ' -- hidden: ' + hidden.map((c) => c.label).join(', ') : ''}`);
  if (vp.height >= 800) {
    check(g.launcher && g.ctas.every((c) => !overlap(c, g.launcher)), `${label}: the chat button does not sit on a hero button`);
  } else {
    // 667px tall: the bar leaves ~540px, the buttons end at ~533, and the chat
    // button (which must stay reachable with the bar up -- chat-launcher.mjs)
    // has nowhere else to go. Known and accepted: it clears once the bar is answered.
    const covered = g.ctas.filter((c) => overlap(c, g.launcher));
    check(covered.length <= 1, `${label}: at most one hero button is partly under the chat button while the bar is up (${covered.map((c) => c.label).join(', ') || 'none'})`);
  }
  const badgeLines = await p.evaluate(() => {
    const b = [...document.querySelectorAll('main section span')].find((e) => /full-service credit union since/i.test(e.textContent));
    const range = document.createRange(); range.selectNodeContents(b);
    return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;   // one entry per rendered line
  });
  check(badgeLines <= 1, `${label}: the "since 1954" badge stays on one line (${badgeLines})`);
  // text lines, not the paragraph's box: the hero text keeps a right-hand gutter for the chat button
  const textLines = await p.evaluate(() => {
    const out = [];
    for (const e of [...document.querySelectorAll('main section p')].slice(0, 2)) {
      const r = document.createRange(); r.selectNodeContents(e);
      for (const c of r.getClientRects()) out.push({ top: c.top, bottom: c.bottom, left: c.left, right: c.right });
    }
    return out;
  });
  check(g.launcher && textLines.every((l) => !overlap(l, g.launcher)), `${label}: nor on any line of the hero text (${textLines.length} lines checked)`);

  // the menu still works, and it is where "Try the demo" is
  await p.locator('button', { hasText: 'Essential only' }).click();
  await menu.click();
  await p.waitForTimeout(400);
  check(await p.locator('button:visible', { hasText: 'Try the demo' }).first().isVisible(), `${label}: opening the menu shows Try the demo`);
  await ctx.close();
}
{
  // and once the header turns cream, the icon has to be dark
  const { ctx, p } = await open({ width: 390, height: 844 }, true);
  await p.locator('button', { hasText: 'Essential only' }).click();
  await p.evaluate(() => scrollTo(0, 700));
  await p.waitForTimeout(700);
  const colour = rgb(await p.locator('button[aria-label="Open menu"]').evaluate((e) => getComputedStyle(e).color));
  check(ratio(colour, CREAM) >= 4.5, `scrolled: the menu icon is readable on the cream header (${ratio(colour, CREAM).toFixed(1)}:1)`);
  await ctx.close();
}

// ---------- desktop ----------
{
  const { ctx, p } = await open({ width: 1440, height: 900 }, false);
  const g = await geometry(p);
  const hidden = g.ctas.filter((c) => c.bottom > g.bar.top);
  check(g.ctas.length === 4 && hidden.length === 0, 'desktop 1440x900: all four hero buttons are above the cookie bar');
  check(g.emptyAboveBadge <= 140, `desktop: no more than ~140px of empty hero above the badge (${Math.round(g.emptyAboveBadge)}px; it was ~250)`);
  const outline = await p.locator('main button', { hasText: 'Ask about insurance' }).evaluate((e) => getComputedStyle(e).color);
  check(ratio(rgb(outline), HERO_LIGHTEST) >= 4.5, `desktop: the outlined hero button is readable (${ratio(rgb(outline), HERO_LIGHTEST).toFixed(1)}:1, needs 4.5; it was 2.8)`);
  await ctx.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
await br.close();
