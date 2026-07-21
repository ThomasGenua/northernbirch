# Northern Birch — Application Security Audit

**Target:** `thomasgenua/northernbirch` (`nbcu-app`) — Next.js 15 + Prisma + PostgreSQL
**Date:** 2026-07-18
**Method:** static source review, `npm audit` dependency audit, live runtime verification (local Postgres, dev server, screenshotted)
**Scope:** 89 files, 18 API routes, 36 pages, full dependency tree

Every finding below was verified against the actual source and, where relevant, reproduced against a running instance — not inferred from the README.

## Summary

| Severity | Count | Status |
|---|---|---|
| Critical | 2 | 1 fixed (dependency RCE) · 1 left as-is by request (sandbox auth) |
| Medium | 1 | Fixed |
| Low | 2 | 1 fixed (missing headers) · 1 accepted residual risk |
| Command injection / file upload / prototype pollution | 0 | None found |

---

## NB-001 — Critical — The likely breach vector — **Fixed**

**Next.js pinned to a version with a public, unauthenticated RCE**
`package.json:25`

This doesn't map to one of your five checklist items directly, but it's the closest match to "RCE that led to a stolen `.env`," so it was checked first.

The app shipped with `"next": "15.0.3"` pinned exactly. That version is inside the affected range for two critical advisories:

- [GHSA-9qr9-h5gf-34mp](https://github.com/advisories/GHSA-9qr9-h5gf-34mp) — *Next.js is vulnerable to RCE in the React Flight protocol* (affects `<15.0.5`)
- [GHSA-f82v-jwr5-mffw](https://github.com/advisories/GHSA-f82v-jwr5-mffw) / CVE-2025-29927 — Next.js middleware authorization bypass (affects `<15.2.3`)

Both are unauthenticated and network-reachable, and were mass-scanned within days of public disclosure — exactly the profile of an opportunistic bot that finds a box, drops a miner, and moves on. `npm audit` lists roughly 20 more advisories (DoS, SSRF, cache poisoning, request smuggling, CSP-nonce XSS) fixed by the same upgrade. A framework RCE doesn't care how careful your own route handlers are — it's a hole in the server underneath them.

**Fix applied:**

```diff
- "next": "15.0.3",
- "react": "19.0.0-rc-66855b96-20241106",
- "react-dom": "19.0.0-rc-66855b96-20241106",
+ "next": "15.5.20",
+ "react": "19.2.7",
+ "react-dom": "19.2.7",
```

---

## NB-002 — Critical if deployed — **Left as-is, per your instruction**

**Authentication is fully disabled — every visitor is the demo account**
`src/middleware.ts:3-5` · `src/lib/auth.ts:87-111`

`middleware.ts` returns `NextResponse.next()` unconditionally for every request, bypassing its own route matcher. `auth.ts`'s `getSession()`/`getCurrentMember()` always return a hardcoded member, and `login()` returns `ok: true` for *any* email/password. The real bcrypt+JWT implementation still exists, commented out in the same file (lines 1-77) — ready to restore.

**The exploit, if this ever faces the internet as-is:** nobody needs a password. `/dashboard`, `/invest`, `/trade`, `/messages` — anyone who requests them gets in as "Maria Tamm," can read her balances, file claims, send transfers, message her advisor. There's no privilege check to bypass because there is no privilege check.

**Status:** left exactly as found, since this is what makes the one-click sandbox demo work. Flagging at Critical anyway — this file is one copy-paste away from becoming production auth.

**To restore before any real deployment:**

```
1. In src/lib/auth.ts — delete the mock block (lines 79-110),
   uncomment the real implementation above it (lines 1-77).
2. In src/middleware.ts — replace the early return with an
   actual session check + redirect to /login when absent.
3. Rotate JWT_SECRET to a real `openssl rand -base64 32` value,
   set only in your host's env store, never in .env.
```

---

## 1. Source code leaks & directory traversal — **Nothing found**

No custom static file server to misconfigure — no `express.static`, no hand-rolled file route. Static assets go through Next's own `public/` convention, and `public/` is **empty**. No route builds a filesystem path from request input. `.env` is correctly `.gitignore`'d and was never committed.

**NB-003 — Medium — Fixed:** `next.config.ts:14-16` had `images.remotePatterns: [{ protocol: "https", hostname: "**" }]` — any HTTPS host, no restriction. Next's built-in image optimizer (`/_next/image?url=...`) is live the moment `images` is configured, regardless of whether any page uses `<Image>`. With a wildcard host, `GET /_next/image?url=https://169.254.169.254/latest/meta-data/&w=256&q=75` makes *your server* fetch that URL — classic SSRF against cloud metadata endpoints or internal services. `next/image` is never imported anywhere in this codebase, so this was pure unused attack surface.

```diff
-  images: {
-    remotePatterns: [{ protocol: "https", hostname: "**" }],
-  },
+  // No remotePatterns: next/image is never used, so a wildcard
+  // host here would only be exploitable attack surface.
```

Also added baseline headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`) in the same file — zero behavior change, closes clickjacking/MIME-sniffing gaps that had no coverage before.

---

## 2. Command injection & unsafe execution — **Nothing found**

Zero hits for `exec(`, `execSync(`, `spawn(`, `eval(`, `new Function(`, or `child_process` anywhere under `src/`, `prisma/`, or the npm scripts. Nothing shells out at all.

The one dynamic-HTML pattern in the codebase — `src/lib/pdf.ts`'s `document.write()` for print-to-PDF — writes the browser's own already-rendered, already-escaped DOM into a popup window; it never touches `dangerouslySetInnerHTML`, so there's no path for injected markup to reach it today. Worth remembering if that helper is ever reused against a container that does use `dangerouslySetInnerHTML`.

---

## 3. Prototype pollution & outdated libraries

**No pollution pattern found.** All 18 API routes follow the same shape: Zod `.safeParse()` against a literal schema, then an explicit field-by-field object built for Prisma — never `{ ...parsed.data }` spread into a query, never `Object.assign(target, req.body)`. Nothing walks or merges arbitrary keys from a request body.

**Dependency upgrades applied:**

| Package | Was | Now | Why |
|---|---|---|---|
| `next` | 15.0.3 | 15.5.20 | Critical RCE + middleware bypass, see NB-001 |
| `react` / `react-dom` | 19.0.0-rc (Nov 2024) | 19.2.7 | Move off a release-candidate build onto stable |
| `@types/react(-dom)` | 19.0.1 | 19.2.x | Match the runtime bump; `type-check` stays clean |
| `form-data` | 4.0.0-4.0.5 | 4.0.6+ | High: CRLF injection in multipart fields (transitive, auto-resolved) |
| `js-yaml` | 4.0-4.1.1 | 4.1.2+ | Moderate ReDoS in merge-key handling (transitive, auto-resolved) |

**Low — accepted residual risk, documented, not fixed:**
- `esbuild` 0.27.x — pulled in only by `tsx` (used exclusively for `npm run db:seed`, never at runtime). The advisory is a Windows-only dev-server file-read bug; irrelevant on Linux with no exposed dev server.
- `postcss` <8.5.10 — vendored *inside* `next@15.5.20` itself. `npm audit fix --force` "resolves" it by downgrading Next to `9.3.3`, which would undo NB-001. Left alone on purpose — re-check next time Next is bumped.

---

## 4. Backdoors / suspicious code — **Nothing found**

- No obfuscation — no heavy base64 blobs, no `atob()`/`btoa()` anywhere in `src/`.
- No hardcoded secrets — only placeholder values in the gitignored `.env` and the local-only Docker Postgres password in `docker-compose.yml`.
- No undocumented routes — all 18 API routes match what's documented in the README.
- One external host, and it's the right one — the only outbound call anywhere is to `api.anthropic.com` via the official SDK, gated behind a real key check.
- Clean supply chain — every entry in `package-lock.json` resolves from `registry.npmjs.org`, no typosquat or off-registry package.
- IDOR checked, not assumed — every route re-derives the caller server-side and scopes every query by `memberId`; trades/transfers re-verify row ownership before mutating.

---

## 5. Input & file-upload flaws — **Nothing found**

No file upload anywhere — no `<input type="file">`, no `FormData` with a file field, no `multer` or equivalent, confirmed by grep across every page and API route. The "Policy Document Reader" AI feature sounds like a file upload but isn't: it's a `<textarea>` that posts pasted text as a JSON string to `/api/chat`, itself gated by a strict Zod schema (max 50 messages, enum'd feature name) before it reaches the Anthropic SDK. The `Document` Prisma model is metadata-only (`storageKey`/`mimeType`/`sizeBytes`) — no code path writes a file to disk from user input.

---

## Sandbox data fixes (functional, not security)

Auth stays mocked, as instructed. These are bugs that surfaced once the app was actually run in a browser, per the requirement that every page show real data.

**NB-004 — Fixed:** `prisma/seed.ts:88` — the mocked session always resolves to member id `"demo-member-101"`, but the seed script created that member with a random `cuid()`. Every member-scoped query (portfolios, trades, watchlist, messages, claims, appointments, notifications, policies, transfers, goals) filters by `memberId: member.id`, so none of them ever matched a seeded row. Pinned the seed's member `id` to `"demo-member-101"` and re-seeded a local Postgres — every one of those endpoints now returns real data with zero other code changes.

**NB-005 — Fixed:** `src/app/invest/page.tsx:13-34` (original) — the page's mock data used `shares`/`averagePrice`, but the render/compute logic expects `quantity`/`avgCost` (plus a `type`/`managed` flag and a trade `totalAmount` that weren't in the mock at all). Every `Number(h.quantity)` read `undefined`, producing "C$NaN" across the whole page. Caught by actually loading the page in a browser, not just reading the code. Renamed the mock fields to match.

**NB-006 — Fixed:** `src/components/Footer.tsx:36` — the "Business" column linked three items to the same `/business` href, keyed by that href, causing a duplicate-key React error on every page (Footer renders everywhere). Keyed by label instead.

**NB-007 — Fixed:** `src/app/mobileapp/page.tsx` and `src/app/referrals/page.tsx` had inert buttons (App Store/Google Play badges, "share your link"). Both now respond — a "coming soon" toast and a real copy-to-clipboard link respectively — matching how every other simulated action in the app behaves.

---

## Before this touches production

The sandbox is intentionally wide open so it can be clicked through. None of this applies until a real domain points at it.

1. **Restore real authentication** — uncomment `src/lib/auth.ts`'s bcrypt+JWT block, wire a real check into `src/middleware.ts` (see NB-002).
2. **Generate a production `JWT_SECRET` and `ANTHROPIC_API_KEY`**, set only in your host's secret store — never in a committed `.env`.
3. **Re-run `npm audit` before every deploy** — NB-001 is a reminder that a pinned framework version silently becomes a liability the day after a CVE lands.
4. **Point `DATABASE_URL` at a real managed Postgres** (Neon/Supabase/RDS) with network rules that don't expose 5432 publicly, and drop the demo password.
5. **Turn on real rate limiting on `/api/auth/*` and `/api/chat`** — both are wide open in the sandbox by design; neither should be in production.
