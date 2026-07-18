# Northern Birch Credit Union — Full-Stack TypeScript Application

A production-ready Next.js 15 + TypeScript + Prisma + PostgreSQL application for Northern Birch Credit Union's insurance distribution and member services platform.

Built by [Oodler](https://oodler.com) as a strategic partnership demonstration.

---

## What's Included

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL 16 (Docker) |
| ORM | Prisma 5 |
| AI | Anthropic Claude SDK (claude-opus-4-5) |
| Auth | JWT + bcrypt + httpOnly cookies |
| Validation | Zod |
| Styling | Inline styles with shared design tokens |
| Deployment | Vercel / any Node.js host |

### Database Models (21 total)

`Member`, `Branch`, `Account`, `Transaction`, `Policy`, `Claim`, `Quote`, `Appointment`, `MessageThread`, `Message`, `Notification`, `Document`, `Transfer`, `CreditScore`, `HealthAssessment`, `AuditLog`, plus the investing models `Portfolio`, `Holding`, `Trade`, `Watchlist`, and `SavingsGoal` — 25 enums for type-safe values.

### API Routes (18)

| Route | Method | Purpose |
|---|---|---|
| `/api/chat` | POST | AI chat (10 system prompts: chat, advisor, analyzer, health, life event, doc reader, tax, Heili, Andres, branch support) |
| `/api/auth/login` | POST | Email + password login |
| `/api/auth/logout` | POST | Clear session (303 redirect for form posts, JSON for fetch) |
| `/api/auth/register` | POST | New member signup: creates member, starter chequing account, welcome notification, session |
| `/api/member/dashboard` | GET | Full member data (accounts, policies, transactions, notifications, threads, credit score, appointments) |
| `/api/quotes` | POST/GET | Calculate and persist insurance quotes |
| `/api/claims` | POST/GET | Submit and list claims |
| `/api/appointments` | POST/GET | Book and list appointments |
| `/api/messages` | POST/GET | Threaded messages with AI-assisted advisor replies |
| `/api/notifications` | GET/PATCH | Read and mark-as-read |
| `/api/transfers` | POST/GET | International transfers (atomic Prisma transaction) |
| `/api/policies` | GET | Active policies |
| `/api/branches` | GET | Branch list |
| `/api/portfolios` | GET | Investment portfolios with live values, gains, holdings |
| `/api/trades` | POST/GET | Buy/sell stocks, ETFs, crypto (atomic holding updates) |
| `/api/market` | GET | Real-time quotes, symbol search, price history |
| `/api/watchlist` | GET/POST/DELETE | Manage watched symbols |
| `/api/goals` | GET/POST | Savings goals |

### Pages (36, fully built — no stubs)

Marketing: Home, Insurance, Travel, Business, Digital, Estate, Community, Personal, Contact, Rates, Mobile App, Blog, Glossary, Referrals, Leadership.

Member: Login, Register, Dashboard, Messages.

Investing (Wealthsimple-class): Invest (portfolio dashboard), Trade (self-directed stocks/ETFs/crypto).

Tools: Quote Calculator, Claims Wizard, Booking, Compare Coverage, Calculators (mortgage/retirement/insurance needs with PDF export).

AI Features: AI Insurance Advisor, Coverage Gap Analyzer, Financial Health Check, Life Event Simulator, Policy Document Reader, Tax & Savings Optimizer.

Legal: Privacy, Terms, Accessibility, Complaints.

### Member Experience

- **Server-rendered dashboard** fetches accounts, policies, transactions, notifications, message threads, credit score, and upcoming appointments from PostgreSQL via Prisma.
- **Live messaging** with AI-assisted replies in character (Heili Orav for wealth, Andres Tamm for insurance, branch support for accounts).
- **Insurance quote calculator** with real actuarial math, persists to DB.
- **Claims filing wizard** with stable reference numbers and notification creation.
- **Appointment booking** that creates real database records and notifications.
- **International transfers** with atomic Prisma transaction (debit account + create transfer + create transaction + create notification).
- **Six AI features** powered by Claude Opus 4.5 with feature-specific system prompts.

### Investing & Wealth (Wealthsimple-class)

- **Portfolio dashboard** (`/invest`) — total value, all-time gain, managed + self-directed + crypto accounts, per-holding breakdown, savings goals with progress bars, recent trades. Computed live from holdings and current prices.
- **Self-directed trading** (`/trade`) — searchable market list of stocks, ETFs, and crypto with live prices and daily change; 90-day SVG price chart per asset; buy/sell ticket with account selection, buying power display, and estimated cost. Trades settle atomically against the account's cash balance: buys verify and debit cash (with average-cost updates), sells credit cash. Insufficient cash or holdings are rejected with clear errors.
- **Managed portfolios** — auto-managed growth portfolios with risk levels (conservative → aggressive).
- **Crypto** — Bitcoin, Ethereum, Solana, XRP holdings and trading.
- **Watchlists** — star/unstar assets from the trade ticket; horizontal watchlist strip with live quotes above the market list.
- **Savings goals** — target amounts, progress tracking, target dates.
- **Market data layer** (`src/lib/market.ts`) — ~20 symbols with deterministic daily price movement and 90-day history series for charts. Swap for a real provider (Polygon, Finnhub) in production.

### Cross-cutting features

- **PDF export** (`src/lib/pdf.ts`) — branded print-to-PDF on calculators and reports.
- **Toast notifications** — global toast system via React context (`useToast`).
- **Cmd+K search** — global search overlay indexing all 28+ destinations.
- **Notifications panel** — bell dropdown fetching from `/api/notifications` with mark-as-read.
- **Cookie consent banner** — PIPEDA-aware, cookie-based (no localStorage).
- **Interactive dashboard widgets** — international transfer widget (live FX), spending breakdown by category, credit score gauge with history.
- **Trilingual** — English, Estonian, Latvian; 86 translated strings via `src/lib/i18n.ts` with a language switcher in the nav.

---

## Setup

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)
- An Anthropic API key (for AI features)

### Quick Start (3 commands)

```bash
git clone <this-repo>
cd nbcu-app
cp .env.example .env  # Edit ANTHROPIC_API_KEY
npm run setup          # Installs deps, starts Postgres, runs migrations, seeds
npm run dev            # Start dev server on http://localhost:3000
```

### Manual Setup

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

```bash
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — already set for Docker Postgres
- `ANTHROPIC_API_KEY` — your Anthropic key for AI features
- `JWT_SECRET` — run `openssl rand -base64 32` to generate

**3. Start PostgreSQL**

```bash
docker compose up -d
```

This runs PostgreSQL 16 on port 5432 with database `nbcu`, user `nbcu`, password `nbcu_dev_password`. Data persists in a Docker volume.

**4. Apply schema and seed data**

```bash
npm run db:push        # Apply schema to database
npm run db:seed        # Insert demo data
```

**5. Start the app**

```bash
npm run dev
```

Visit http://localhost:3000.

### Demo Login

```
Email:    maria.tamm@example.com
Password: demo123
```

Maria has 4 accounts ($69K assets, $387K mortgage), 4 active policies, 3 investment portfolios with cash balances, a credit score of 782, 8 notifications, an active message thread with Heili Orav, and an upcoming appointment. Alternatively, create a fresh member through `/register`.

---

## Available Commands

| Command | Action |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run type-check` | Run TypeScript type checker |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:reset` | Wipe and re-seed database |
| `npm run db:seed` | Run seed script |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run docker:up` | Start PostgreSQL |
| `npm run docker:down` | Stop PostgreSQL |
| `npm run setup` | Full setup in one command |

---

## Project Structure

```
nbcu-app/
├── prisma/
│   ├── schema.prisma          # 21 models, 25 enums
│   └── seed.ts                # Realistic demo data
├── src/
│   ├── app/
│   │   ├── api/               # 18 route handlers
│   │   ├── dashboard/         # Member dashboard (server component)
│   │   ├── messages/          # Threaded messaging UI
│   │   ├── quote/             # Interactive quote calculator
│   │   ├── claims/            # Claims wizard
│   │   ├── booking/           # Appointment booking
│   │   ├── login/             # Auth
│   │   ├── ai-advisor/, analyzer/, healthcheck/, life-event/, doc-reader/, tax/  # AI features
│   │   ├── insurance/, travel/, business/, ... # Marketing pages
│   │   ├── layout.tsx
│   │   └── page.tsx           # Home
│   ├── components/
│   │   ├── Nav.tsx            # Top navigation with i18n
│   │   ├── Footer.tsx
│   │   ├── ChatWidget.tsx     # Floating AI chat
│   │   ├── SiteShell.tsx      # Layout wrapper
│   │   └── AIFeaturePage.tsx  # Reusable AI feature template
│   ├── lib/
│   │   ├── db.ts              # Prisma singleton
│   │   ├── ai.ts              # Anthropic SDK wrapper + system prompts
│   │   ├── auth.ts            # JWT + bcrypt
│   │   ├── quotes.ts          # Insurance pricing math
│   │   ├── theme.ts           # Design tokens
│   │   └── i18n.ts            # EN/EST/LAT translations
│   ├── types/
│   │   └── index.ts           # Shared types
│   └── middleware.ts          # Auth-protected routes (/dashboard, /messages, /invest, /trade)
├── docker-compose.yml         # PostgreSQL container
├── .env.example
├── package.json
├── tsconfig.json              # Strict TypeScript
└── next.config.ts
```

---

## Architectural Decisions

### Why Next.js App Router

Server components let the dashboard fetch from Postgres directly without an extra API hop. Client components handle interactivity (forms, AI chat, notifications). API routes serve external clients and form submissions.

### Why Prisma

Type-safe database queries, automatic migrations, generated TypeScript types, and a great developer experience with Prisma Studio for inspection.

### Why JWT + httpOnly cookies

Session tokens in httpOnly cookies prevent XSS theft. JWT eliminates server-side session storage. 7-day expiration with explicit logout.

### Why Anthropic SDK on the server

API key stays on the server. Client never sees credentials. All AI features go through `/api/chat` which validates input with Zod before forwarding to Claude.

### Why atomic transactions for transfers

International transfers must update three tables (debit account, create transfer record, create transaction record) plus send a notification. Wrapping in `prisma.$transaction` guarantees all-or-nothing.

---

## Production Deployment

### Recommended: Vercel + Neon/Supabase

```bash
# 1. Push to GitHub
# 2. Connect repo to Vercel
# 3. Set environment variables:
#    - DATABASE_URL (Neon/Supabase Postgres URL)
#    - ANTHROPIC_API_KEY
#    - JWT_SECRET (production-grade)
# 4. Deploy
```

Run migrations once after deployment:

```bash
npx prisma migrate deploy
npm run db:seed  # Optional — seed production data carefully
```

### Self-hosted: Docker

```bash
docker build -t nbcu-app .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://... \
  -e ANTHROPIC_API_KEY=... \
  -e JWT_SECRET=... \
  nbcu-app
```

---

## Compliance Notes

This application is built for Canadian financial services context:

- **PIPEDA** — Member data stored in Canada (specify `ca-central-1` or equivalent region for production).
- **AODA** — Semantic HTML, keyboard navigation, sufficient color contrast.
- **FSRA** — Insurance distribution model (NOT manufacturing). Credit union refers members to insurer's licensed agents under referral arrangements.
- **FINTRAC** — KYC verification fields on Member model. Integration with identity verification services (Jumio) recommended for production.
- **CASL** — Marketing email opt-in tracking should be added to Member model for production.

This is a demonstration application. Production deployment requires additional security hardening, audit logging, monitoring, and compliance review.

---

## What This Replaces

This TypeScript application replaces the original single-file React demo (2,780 lines, in-memory state, mock data). The full-stack version provides:

- ✅ Real PostgreSQL persistence
- ✅ Type-safe end-to-end (Prisma → API → React)
- ✅ Real authentication with JWT
- ✅ Server-rendered dashboards (faster, SEO-ready)
- ✅ Atomic transactions for financial operations
- ✅ Audit logs for compliance
- ✅ Production-ready architecture

The marketing/demo content from the React version is preserved. The architectural foundation is now production-grade.

---

## License

Proprietary. © 2026 Oodler Inc.

Built for Northern Birch Credit Union strategic partnership evaluation.

For inquiries: thomas@oodler.com
