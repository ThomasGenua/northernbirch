import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { colors as C, fonts as F } from "@/lib/theme";
import { TransferWidget, SpendingBreakdown, CreditScoreGauge } from "@/components/DashboardWidgets";

export default async function DashboardPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");

 
const accounts = [
  { id: "a1", type: "CHEQUING", accountNumber: "10492-482", balance: "2450.75" },
  { id: "a2", type: "HIGH_INTEREST_SAVINGS", accountNumber: "90214-993", balance: "18250.00" },
  { id: "a3", type: "MORTGAGE", accountNumber: "MTG-9481", balance: "-385420.00" }
];

const policies = [
  { id: "p1", type: "TERM_LIFE", provider: "CUMIS", renewalDate: "2027-06-15", monthlyPremium: "35.00" },
  { id: "p2", type: "HOME", provider: "The_Personal", renewalDate: "2026-11-20", monthlyPremium: "112.50" },
  { id: "p3", type: "AUTO", provider: "The_Personal", renewalDate: "2026-11-20", monthlyPremium: "145.00" }
];

const transactions = [
  { id: "t1", description: "Sobeys Grocery", category: "Food", amount: "-84.22", postedAt: "2026-06-12" },
  { id: "t2", description: "The Personal Auto Ins.", category: "Insurance", amount: "-145.00", postedAt: "2026-06-01" },
  { id: "t3", description: "CUMIS Life Premium", category: "Insurance", amount: "-35.00", postedAt: "2026-06-01" },
  { id: "t4", description: "Payroll Deposit NBCU", category: "Income", amount: "3240.50", postedAt: "2026-05-30" }
];

const notifications = [
  { id: "n1", iconKey: "🔒", title: "Security Settings Check", body: "Your digital bank profile is protected using bank-grade client tokens.", read: false }
];

const threads = [
  { id: "th1", advisorName: "Heili Orav", advisorRole: "Wealth & Estate Services Manager", messages: [{ content: "Tere Maria! I reviewed your retirement projection goals." }] }
];

const creditScore = { score: 765, history: [{ score: 750 }, { score: 755 }, { score: 760 }, { score: 765 }] };
const upcomingApt = { service: "WEALTH_REVIEW", scheduledAt: "2026-06-25T14:00:00.000Z", branch: { name: "Tartu College Branch" } };

  const coverageTypes = ["TERM_LIFE", "HOME", "AUTO", "DISABILITY", "CRITICAL_ILLNESS", "TRAVEL"];
  const covered = coverageTypes.filter((t) => policies.some((p: any) => p.type === t));
  const coverageScore = Math.round((covered.length / coverageTypes.length) * 100);
  const totalAssets = accounts.filter((a: any) => Number(a.balance) > 0).reduce((s: number, a: any) => s + Number(a.balance), 0);
  const totalDebts = accounts.filter((a: any) => Number(a.balance) < 0).reduce((s: number, a: any) => s + Math.abs(Number(a.balance)), 0);

  // Prisma Decimal and Date objects cannot cross the server->client component
  // boundary. Serialize to plain JSON-safe objects for client widgets.
  const plainAccounts = accounts.map((a: any) => ({
    id: a.id, type: a.type, accountNumber: a.accountNumber, balance: Number(a.balance),
  }));
  const plainTransactions = transactions.map((t: any) => ({
    id: t.id, amount: Number(t.amount), category: t.category, description: t.description,
  }));

  return (
    <div style={{ background: C.cream, paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: F.sans, fontSize: 13, color: C.accent, fontWeight: 700, marginBottom: 4 }}>Member #{member.memberNumber}</p>
          <h1 style={{ fontFamily: F.serif, fontSize: 32, color: C.navy, margin: 0 }}>Welcome back, {member.firstName}</h1>
          <p style={{ fontFamily: F.sans, fontSize: 14, color: "#999", margin: "4px 0 0" }}>{member.branch?.name ?? "Northern Birch Member"}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          {/* Top stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { label: "Total Assets", value: `C$${totalAssets.toLocaleString("en-CA", { minimumFractionDigits: 2 })}`, color: C.green },
              { label: "Total Debts", value: `C$${totalDebts.toLocaleString("en-CA", { minimumFractionDigits: 2 })}`, color: C.red },
              { label: "Credit Score", value: creditScore?.score ?? "—", color: C.accent, sub: "Equifax" },
              { label: "Coverage Score", value: `${coverageScore}/100`, color: C.purple, sub: `${covered.length}/${coverageTypes.length} types` },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #eee" }}>
                <div style={{ fontFamily: F.sans, fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>{stat.label}</div>
                <div style={{ fontFamily: F.serif, fontSize: 24, color: stat.color, fontWeight: 700, marginTop: 4 }}>{stat.value}</div>
                {stat.sub && <div style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb", marginTop: 2 }}>{stat.sub}</div>}
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/quote" style={{ background: C.accent, color: "#fff", padding: "10px 20px", borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Get a Quote</Link>
            <Link href="/invest" style={{ background: C.navy, color: "#fff", padding: "10px 20px", borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Invest</Link>
            <Link href="/messages" style={{ background: C.purple, color: "#fff", padding: "10px 20px", borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Messages</Link>
            <Link href="/booking" style={{ background: C.green, color: "#fff", padding: "10px 20px", borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 600 }}>Book Advisor</Link>
            <Link href="/healthcheck" style={{ background: "#fff", color: C.navy, padding: "10px 20px", borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 600, border: "1px solid #ddd" }}>Health Check</Link>
            <form action="/api/auth/logout" method="POST" style={{ marginLeft: "auto" }}>
              <button type="submit" style={{ background: "#fff", color: C.red, padding: "10px 20px", borderRadius: 10, fontFamily: F.sans, fontSize: 13, fontWeight: 600, border: "1px solid #ddd" }}>Sign Out</button>
            </form>
          </div>

          {/* Widgets row: credit score, spending, transfer */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {creditScore && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
                <h3 style={{ fontFamily: F.serif, fontSize: 16, color: C.navy, margin: "0 0 16px" }}>Credit Score</h3>
                <CreditScoreGauge score={creditScore.score} history={JSON.parse(JSON.stringify(creditScore.history ?? []))} />
              </div>
            )}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
              <h3 style={{ fontFamily: F.serif, fontSize: 16, color: C.navy, margin: "0 0 16px" }}>Spending Breakdown</h3>
              <SpendingBreakdown transactions={plainTransactions} />
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
              <h3 style={{ fontFamily: F.serif, fontSize: 16, color: C.navy, margin: "0 0 16px" }}>Quick Transfer</h3>
              <TransferWidget accounts={plainAccounts} />
            </div>
          </div>

          {/* Two-column body */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {/* Accounts */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
                <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, margin: "0 0 16px" }}>Accounts</h3>
                {accounts.map((a: any) => (
                  <div key={a.id} style={{ padding: "10px 0", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 600 }}>{a.type.replace("_", " ")}</div>
                      <div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>{a.accountNumber}</div>
                    </div>
                    <div style={{ fontFamily: F.serif, fontSize: 16, color: Number(a.balance) >= 0 ? C.navy : C.red, fontWeight: 700 }}>
                      C${Number(a.balance).toLocaleString("en-CA", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Policies */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
                <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, margin: "0 0 16px" }}>Active Policies</h3>
                {policies.length === 0 && <p style={{ fontSize: 13, color: "#999" }}>No active policies. <Link href="/insurance" style={{ color: C.accent }}>Browse insurance →</Link></p>}
                {policies.map((p: any) => (
                  <div key={p.id} style={{ padding: "10px 0", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 600 }}>{p.type.replace(/_/g, " ")}</div>
                      <div style={{ fontFamily: F.sans, fontSize: 11, color: "#999" }}>{p.provider.replace("_", " ")} · Renews {new Date(p.renewalDate).toLocaleDateString("en-CA")}</div>
                    </div>
                    <div style={{ fontFamily: F.serif, fontSize: 14, color: C.green, fontWeight: 700 }}>C${Number(p.monthlyPremium).toFixed(2)}/mo</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {/* Recent Transactions */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
                <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, margin: "0 0 16px" }}>Recent Activity</h3>
                {transactions.map((tx: any) => (
                  <div key={tx.id} style={{ padding: "8px 0", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: F.sans, fontSize: 12, color: C.navy }}>{tx.description}</div>
                      <div style={{ fontFamily: F.sans, fontSize: 10, color: "#bbb" }}>{tx.category} · {new Date(tx.postedAt).toLocaleDateString("en-CA")}</div>
                    </div>
                    <div style={{ fontFamily: F.sans, fontSize: 13, color: Number(tx.amount) >= 0 ? C.green : C.navy, fontWeight: 600 }}>
                      {Number(tx.amount) >= 0 ? "+" : ""}C${Number(tx.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notifications */}
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
                <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, margin: "0 0 16px" }}>Notifications</h3>
                {notifications.length === 0 && <p style={{ fontSize: 13, color: "#999" }}>All caught up!</p>}
                {notifications.map((n: any) => (
                  <div key={n.id} style={{ padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 600 }}>{n.iconKey} {n.title}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 11, color: "#777", marginTop: 2 }}>{n.body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            {threads.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: F.serif, fontSize: 18, color: C.navy, margin: 0 }}>Recent Messages</h3>
                  <Link href="/messages" style={{ fontFamily: F.sans, fontSize: 12, color: C.accent, fontWeight: 600 }}>View all →</Link>
                </div>
                {threads.map((t: any) => (
                  <Link key={t.id} href={`/messages?thread=${t.id}` as never} style={{ display: "block", padding: "10px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ fontFamily: F.sans, fontSize: 13, color: C.navy, fontWeight: 600 }}>{t.advisorName} · {t.advisorRole}</div>
                    <div style={{ fontFamily: F.sans, fontSize: 12, color: "#777", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.messages[0]?.content}</div>
                  </Link>
                ))}
              </div>
            )}

            {/* Upcoming Appointment */}
            {upcomingApt && (
              <div style={{ background: `${C.amber}08`, borderRadius: 16, padding: 24, border: `1px solid ${C.amber}30` }}>
                <h3 style={{ fontFamily: F.serif, fontSize: 16, color: C.navy, margin: "0 0 8px" }}>📅 Upcoming Appointment</h3>
                <p style={{ fontFamily: F.sans, fontSize: 13, color: "#555", margin: 0 }}>
                  {upcomingApt.service.replace(/_/g, " ")} at {upcomingApt.branch?.name ?? "your branch"}<br />
                  <strong>{new Date(upcomingApt.scheduledAt).toLocaleString("en-CA", { dateStyle: "full", timeStyle: "short" })}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
