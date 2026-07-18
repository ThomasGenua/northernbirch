import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.healthAssessment.deleteMany();
  await prisma.creditScore.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.member.deleteMany();
  await prisma.branch.deleteMany();

  // ============ BRANCHES ============
  const branches = await Promise.all([
    prisma.branch.create({
      data: {
        name: "Latvian Centre Branch",
        address: "4 Credit Union Drive",
        city: "North York",
        province: "ON",
        postalCode: "M4A 2N8",
        phone: "416-465-4659",
        latitude: 43.7615,
        longitude: -79.4111,
        hours: {
          mon: "10:00-15:00", tue: "10:00-15:00", wed: "10:00-15:00",
          thu: "10:00-19:00", fri: "10:00-15:00", sat: "09:00-13:00", sun: "closed"
        },
      },
    }),
    prisma.branch.create({
      data: {
        name: "Tartu College Branch",
        address: "310 Bloor Street West",
        city: "Toronto",
        province: "ON",
        postalCode: "M5S 1W4",
        phone: "416-922-2551",
        latitude: 43.6678,
        longitude: -79.4045,
        hours: { mon: "10:00-15:00", tue: "10:00-15:00", wed: "10:00-15:00",
                 thu: "10:00-15:00", fri: "10:00-15:00", sat: "closed", sun: "closed" },
      },
    }),
    prisma.branch.create({
      data: {
        name: "Hamilton Branch",
        address: "16 Queen Street North",
        city: "Hamilton",
        province: "ON",
        postalCode: "L8R 2T9",
        phone: "905-527-4344",
        hours: { mon: "closed", tue: "10:00-15:00", wed: "10:00-15:00",
                 thu: "10:00-19:00", fri: "10:00-15:00", sat: "closed", sun: "closed" },
      },
    }),
    prisma.branch.create({
      data: {
        name: "KESKUS Branch",
        address: "Madison Avenue",
        city: "Toronto",
        province: "ON",
        postalCode: "M5R 2S5",
        phone: "416-465-4659",
        hours: { coming_soon: true },
      },
    }),
  ]);

  console.log(`✓ Created ${branches.length} branches`);

  // ============ DEMO MEMBER ============
  const passwordHash = await bcrypt.hash("demo123", 10);
  const member = await prisma.member.create({
    data: {
      // Fixed ID: src/lib/auth.ts returns this same id for the sandboxed
      // demo session, so every memberId-scoped query resolves to this row.
      id: "demo-member-101",
      memberNumber: "NB-2018-4421",
      firstName: "Maria",
      lastName: "Tamm",
      email: "maria.tamm@example.com",
      phone: "416-555-0142",
      dateOfBirth: new Date("1989-03-15"),
      preferredLang: "EN",
      passwordHash,
      identityVerified: true,
      kycStatus: "VERIFIED",
      branchId: branches[0].id,
      memberSince: new Date("2018-06-15"),
      lastLogin: new Date(),
    },
  });

  console.log(`✓ Created demo member: ${member.email} / demo123`);

  // ============ ACCOUNTS ============
  const [chequing, tfsa, rrsp, mortgage] = await Promise.all([
    prisma.account.create({
      data: { memberId: member.id, accountNumber: "01234-6742", type: "CHEQUING", balance: "4237.89" },
    }),
    prisma.account.create({
      data: { memberId: member.id, accountNumber: "01234-3891", type: "TFSA", balance: "18450.00" },
    }),
    prisma.account.create({
      data: { memberId: member.id, accountNumber: "01234-4510", type: "RRSP", balance: "47200.00" },
    }),
    prisma.account.create({
      data: { memberId: member.id, accountNumber: "01234-1205", type: "MORTGAGE", balance: "-387200.44" },
    }),
  ]);

  // ============ TRANSACTIONS ============
  const txData = [
    { acc: chequing.id, amt: -150, type: "TRANSFER_OUT" as const, desc: "Interac e-Transfer to Laila J.", cat: "Transfer", days: 0 },
    { acc: chequing.id, amt: -87.43, type: "PURCHASE" as const, desc: "Apple Pay - Loblaws", cat: "Food & Grocery", days: 1 },
    { acc: mortgage.id, amt: -1847.22, type: "PAYMENT" as const, desc: "Mortgage Payment", cat: "Housing", days: 4 },
    { acc: chequing.id, amt: -142.50, type: "INSURANCE_PREMIUM" as const, desc: "Home Insurance - The Personal", cat: "Insurance", days: 4 },
    { acc: chequing.id, amt: 3245, type: "DEPOSIT" as const, desc: "Payroll Deposit - TechCorp Inc.", cat: "Income", days: 5 },
    { acc: chequing.id, amt: -18.45, type: "PURCHASE" as const, desc: "Google Pay - Uber", cat: "Transportation", days: 6 },
    { acc: chequing.id, amt: -275, type: "INTL_TRANSFER" as const, desc: "International Transfer to Riga", cat: "Int'l Transfer", days: 9 },
    { acc: tfsa.id, amt: 112.50, type: "INTEREST" as const, desc: "GIC Interest Credited", cat: "Investment Income", days: 18 },
  ];

  for (const tx of txData) {
    await prisma.transaction.create({
      data: {
        accountId: tx.acc, memberId: member.id, amount: tx.amt.toString(),
        type: tx.type, description: tx.desc, category: tx.cat,
        postedAt: new Date(Date.now() - tx.days * 86400000),
      },
    });
  }

  console.log(`✓ Created ${txData.length} transactions`);

  // ============ POLICIES ============
  await Promise.all([
    prisma.policy.create({
      data: {
        memberId: member.id, policyNumber: "HP-2024-88721", type: "HOME",
        provider: "THE_PERSONAL", status: "ACTIVE",
        coverageAmount: "650000", monthlyPremium: "142.50", annualPremium: "1710",
        deductible: "1000",
        startDate: new Date("2024-04-15"), renewalDate: new Date("2026-04-15"),
        metadata: { perils: "All Risks", liability: "2000000", waterDamage: true },
      },
    }),
    prisma.policy.create({
      data: {
        memberId: member.id, policyNumber: "AP-2024-34219", type: "AUTO",
        provider: "THE_PERSONAL", status: "ACTIVE",
        coverageAmount: "2000000", monthlyPremium: "168.00", annualPremium: "2016",
        deductible: "500",
        startDate: new Date("2024-06-01"), renewalDate: new Date("2026-06-01"),
        metadata: { vehicleYear: 2022, ajustoEnrolled: true },
      },
    }),
    prisma.policy.create({
      data: {
        memberId: member.id, policyNumber: "TL-2025-11087", type: "TERM_LIFE",
        provider: "CUMIS", status: "ACTIVE",
        coverageAmount: "500000", monthlyPremium: "32.50", annualPremium: "390",
        startDate: new Date("2025-01-15"), renewalDate: new Date("2045-01-15"),
        metadata: { termYears: 20, smoker: false, beneficiary: "Spouse" },
      },
    }),
    prisma.policy.create({
      data: {
        memberId: member.id, policyNumber: "MP-2024-55432", type: "MORTGAGE_PROTECTION",
        provider: "CUMIS", status: "ACTIVE",
        coverageAmount: "387200", monthlyPremium: "0.00", annualPremium: "0",
        startDate: new Date("2024-04-15"), renewalDate: new Date("2029-04-15"),
        metadata: { tiedToMortgage: "01234-1205", includesDisability: true },
      },
    }),
  ]);

  console.log(`✓ Created 4 policies`);

  // ============ CREDIT SCORE ============
  await prisma.creditScore.create({
    data: {
      memberId: member.id, score: 782, bureau: "Equifax",
      paymentHistory: 100, utilization: 18, creditAge: 8, recentInquiries: 1,
      history: [
        { date: "2026-01-01", score: 770 }, { date: "2026-02-01", score: 776 },
        { date: "2026-03-01", score: 782 },
      ],
    },
  });

  // ============ NOTIFICATIONS ============
  const notifications = [
    { type: "RENEWAL" as const, title: "Home Insurance Renewal in 28 Days",
      body: "Your home insurance with The Personal renews April 15, 2026 at C$142.50/month. Review coverage to ensure you're still adequately protected.",
      iconKey: "🔔", actionUrl: "/insurance", actionLabel: "Review Coverage", priority: "HIGH" as const, hoursAgo: 2 },
    { type: "SIGNATURE_REQUEST" as const, title: "Document Awaiting Your Signature",
      body: "Critical Illness Insurance Application from CUMIS is ready for e-signature.",
      iconKey: "✍️", actionUrl: "/dashboard", actionLabel: "Sign Now", priority: "HIGH" as const, hoursAgo: 5 },
    { type: "LIFE_EVENT" as const, title: "Life Event Reminder: Mortgage Anniversary",
      body: "It's been one year since your mortgage with Northern Birch. Time for a coverage review.",
      iconKey: "🎉", actionUrl: "/healthcheck", actionLabel: "Run Health Check", priority: "NORMAL" as const, hoursAgo: 24 },
    { type: "ADVISOR_MESSAGE" as const, title: "New Message from Heili Orav",
      body: "Heili replied to your question about TFSA contribution room.",
      iconKey: "💬", actionUrl: "/messages", actionLabel: "Read Message", priority: "NORMAL" as const, hoursAgo: 26, read: true },
    { type: "TRANSFER" as const, title: "International Transfer Delivered",
      body: "Your C$200 transfer to Maija in Riga has been received.",
      iconKey: "✅", actionUrl: "/dashboard", actionLabel: "View Transfer", priority: "LOW" as const, hoursAgo: 48, read: true },
    { type: "RATE_ALERT" as const, title: "GIC Rate Increase",
      body: "Northern Birch is offering a special 5-year GIC rate of 3.45% — up from 3.20%.",
      iconKey: "📈", actionUrl: "/rates", actionLabel: "View Rates", priority: "NORMAL" as const, hoursAgo: 72, read: true },
    { type: "CLAIM_UPDATE" as const, title: "Claim CL-2024-3387 Approved",
      body: "Your auto insurance claim for windshield damage has been approved. C$847 will be deposited within 3 business days.",
      iconKey: "☑️", actionUrl: "/claims", actionLabel: "View Details", priority: "NORMAL" as const, hoursAgo: 168, read: true },
    { type: "APPOINTMENT" as const, title: "Upcoming: Insurance Review",
      body: "Your insurance review with Heili Orav is scheduled for March 25 at 10:30 AM.",
      iconKey: "📅", actionUrl: "/booking", actionLabel: "View Appointment", priority: "NORMAL" as const, hoursAgo: 168, read: true },
  ];

  for (const n of notifications) {
    const { hoursAgo, read = false, ...data } = n;
    await prisma.notification.create({
      data: { ...data, memberId: member.id, read, createdAt: new Date(Date.now() - hoursAgo * 3600000) },
    });
  }

  console.log(`✓ Created ${notifications.length} notifications`);

  // ============ MESSAGE THREADS ============
  const heiliThread = await prisma.messageThread.create({
    data: {
      memberId: member.id, advisorId: "advisor-heili", advisorName: "Heili Orav",
      advisorRole: "Wealth & Estate Advisor", subject: "TFSA Contribution Strategy",
      status: "OPEN",
    },
  });

  const heiliMessages = [
    { from: "ADVISOR" as const, content: "Hi Maria! I just reviewed your TFSA situation. You have C$22,500 of unused contribution room from prior years — that's a great opportunity for tax-free growth. Want to set up a transfer?", hoursAgo: 30 },
    { from: "MEMBER" as const, content: "That sounds great! Can we do C$15,000 from my chequing into the TFSA?", hoursAgo: 28 },
    { from: "ADVISOR" as const, content: "Absolutely. I'll set up the transfer for you. Question: would you like to invest it in our high-interest savings (currently 2.0%) or our 1-year GIC at 2.7%?", hoursAgo: 27 },
    { from: "MEMBER" as const, content: "Let's do the GIC. Should we book a call to talk about the ladder strategy?", hoursAgo: 4 },
    { from: "ADVISOR" as const, content: "Perfect. I have time Tuesday at 10:30 AM at the Latvian Centre branch, or we can do video. Either works for you?", hoursAgo: 3 },
  ];

  for (const m of heiliMessages) {
    await prisma.message.create({
      data: {
        threadId: heiliThread.id, fromType: m.from,
        fromId: m.from === "MEMBER" ? member.id : "advisor-heili",
        fromName: m.from === "MEMBER" ? "Maria Tamm" : "Heili Orav",
        content: m.content, read: m.hoursAgo > 24,
        createdAt: new Date(Date.now() - m.hoursAgo * 3600000),
      },
    });
  }

  console.log(`✓ Created message thread with ${heiliMessages.length} messages`);

  // ============ APPOINTMENTS ============
  await prisma.appointment.create({
    data: {
      memberId: member.id, branchId: branches[0].id, service: "INSURANCE_QUOTE",
      scheduledAt: new Date(Date.now() + 6 * 86400000),
      durationMinutes: 60, advisorName: "Heili Orav", status: "CONFIRMED",
    },
  });

  // ============ TRANSFERS ============
  await prisma.transfer.create({
    data: {
      memberId: member.id, trackingId: "NB-TXN-487291",
      fromAccountId: chequing.id, recipientName: "Maija Tamm",
      recipientCity: "Riga", recipientCountry: "Latvia",
      amountCAD: "200", exchangeRate: "0.6821", amountForeign: "136.42",
      currency: "EUR", fee: "4.99", status: "DELIVERED",
      initiatedAt: new Date(Date.now() - 2 * 86400000),
      deliveredAt: new Date(Date.now() - 1 * 86400000),
    },
  });

  // ============ DOCUMENTS ============
  await Promise.all([
    prisma.document.create({
      data: {
        memberId: member.id, name: "Critical Illness Insurance Application",
        type: "SIGNATURE_REQUIRED", storageKey: "docs/sig-001.pdf",
        mimeType: "application/pdf", sizeBytes: 245000, signatureRequired: true,
      },
    }),
    prisma.document.create({
      data: {
        memberId: member.id, name: "TFSA Beneficiary Designation Update",
        type: "SIGNATURE_REQUIRED", storageKey: "docs/sig-002.pdf",
        mimeType: "application/pdf", sizeBytes: 124000, signatureRequired: true,
      },
    }),
    prisma.document.create({
      data: {
        memberId: member.id, name: "Home Insurance Policy Renewal",
        type: "POLICY", storageKey: "docs/pol-001.pdf",
        mimeType: "application/pdf", sizeBytes: 380000,
        signedAt: new Date("2026-02-28"),
      },
    }),
  ]);

  // ============ INVESTING ============
  const managedPortfolio = await prisma.portfolio.create({
    data: {
      memberId: member.id, name: "Managed Growth Portfolio", type: "MANAGED",
      riskLevel: "GROWTH", totalValue: "52340.18", totalDeposited: "45000", cashBalance: "1240.50", managed: true,
    },
  });
  const cryptoPortfolio = await prisma.portfolio.create({
    data: {
      memberId: member.id, name: "Crypto", type: "CRYPTO",
      riskLevel: "AGGRESSIVE", totalValue: "8420.55", totalDeposited: "6500", cashBalance: "350.00", managed: false,
    },
  });
  const selfDirected = await prisma.portfolio.create({
    data: {
      memberId: member.id, name: "Self-Directed (TFSA)", type: "SELF_DIRECTED",
      riskLevel: "BALANCED", totalValue: "18450.00", totalDeposited: "15000", cashBalance: "2150.00", managed: false,
    },
  });

  await Promise.all([
    prisma.holding.create({ data: { portfolioId: managedPortfolio.id, symbol: "VEQT", name: "Vanguard All-Equity ETF", assetType: "ETF", quantity: "420", avgCost: "38.50", currentPrice: "44.82" } }),
    prisma.holding.create({ data: { portfolioId: managedPortfolio.id, symbol: "XGRO", name: "iShares Core Growth ETF", assetType: "ETF", quantity: "180", avgCost: "32.10", currentPrice: "35.40" } }),
    prisma.holding.create({ data: { portfolioId: managedPortfolio.id, symbol: "ZAG", name: "BMO Aggregate Bond ETF", assetType: "BOND", quantity: "300", avgCost: "14.20", currentPrice: "13.95" } }),
    prisma.holding.create({ data: { portfolioId: cryptoPortfolio.id, symbol: "BTC", name: "Bitcoin", assetType: "CRYPTO", quantity: "0.085", avgCost: "62000", currentPrice: "78400" } }),
    prisma.holding.create({ data: { portfolioId: cryptoPortfolio.id, symbol: "ETH", name: "Ethereum", assetType: "CRYPTO", quantity: "1.2", avgCost: "2800", currentPrice: "3150" } }),
    prisma.holding.create({ data: { portfolioId: selfDirected.id, symbol: "AAPL", name: "Apple Inc.", assetType: "STOCK", quantity: "25", avgCost: "175.40", currentPrice: "228.50" } }),
    prisma.holding.create({ data: { portfolioId: selfDirected.id, symbol: "SHOP", name: "Shopify Inc.", assetType: "STOCK", quantity: "40", avgCost: "82.30", currentPrice: "108.20" } }),
    prisma.holding.create({ data: { portfolioId: selfDirected.id, symbol: "VFV", name: "Vanguard S&P 500 ETF", assetType: "ETF", quantity: "60", avgCost: "118.00", currentPrice: "142.80" } }),
  ]);

  const tradeData = [
    { p: selfDirected.id, sym: "AAPL", name: "Apple Inc.", at: "STOCK" as const, side: "BUY" as const, qty: "25", price: "175.40", days: 120 },
    { p: selfDirected.id, sym: "SHOP", name: "Shopify Inc.", at: "STOCK" as const, side: "BUY" as const, qty: "40", price: "82.30", days: 95 },
    { p: cryptoPortfolio.id, sym: "BTC", name: "Bitcoin", at: "CRYPTO" as const, side: "BUY" as const, qty: "0.085", price: "62000", days: 60 },
    { p: selfDirected.id, sym: "VFV", name: "Vanguard S&P 500 ETF", at: "ETF" as const, side: "BUY" as const, qty: "60", price: "118.00", days: 45 },
    { p: cryptoPortfolio.id, sym: "ETH", name: "Ethereum", at: "CRYPTO" as const, side: "BUY" as const, qty: "1.2", price: "2800", days: 30 },
  ];
  for (const t of tradeData) {
    await prisma.trade.create({
      data: {
        portfolioId: t.p, memberId: member.id, symbol: t.sym, name: t.name, assetType: t.at,
        side: t.side, quantity: t.qty, price: t.price,
        totalAmount: (Number(t.qty) * Number(t.price)).toFixed(2),
        executedAt: new Date(Date.now() - t.days * 86400000),
      },
    });
  }

  await Promise.all([
    prisma.watchlist.create({ data: { memberId: member.id, symbol: "TSLA", name: "Tesla Inc.", assetType: "STOCK" } }),
    prisma.watchlist.create({ data: { memberId: member.id, symbol: "NVDA", name: "NVIDIA Corp.", assetType: "STOCK" } }),
    prisma.watchlist.create({ data: { memberId: member.id, symbol: "VDY", name: "Vanguard FTSE Cdn High Div ETF", assetType: "ETF" } }),
    prisma.watchlist.create({ data: { memberId: member.id, symbol: "SOL", name: "Solana", assetType: "CRYPTO" } }),
  ]);

  await Promise.all([
    prisma.savingsGoal.create({ data: { memberId: member.id, name: "Emergency Fund", targetAmount: "25000", currentAmount: "18450", icon: "🛟", targetDate: new Date("2026-12-31") } }),
    prisma.savingsGoal.create({ data: { memberId: member.id, name: "Riga Trip 2026", targetAmount: "8000", currentAmount: "3200", icon: "✈️", targetDate: new Date("2026-07-01") } }),
    prisma.savingsGoal.create({ data: { memberId: member.id, name: "Home Down Payment", targetAmount: "120000", currentAmount: "47200", icon: "🏠", targetDate: new Date("2028-06-01") } }),
  ]);

  console.log("✓ Created investing data (3 portfolios, 8 holdings, 5 trades, 4 watchlist, 3 goals)");

  console.log("✓ Seed complete!");
  console.log("");
  console.log("Demo login:");
  console.log("  Email: maria.tamm@example.com");
  console.log("  Password: demo123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
