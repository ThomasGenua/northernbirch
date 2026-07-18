import { colors as C, fonts as F } from "@/lib/theme";
const POSTS = [
  { title: "Do You Have Enough Life Insurance?", cat: "Insurance", read: "5 min", excerpt: "A simple framework to calculate your coverage needs based on income, debt, and dependents." },
  { title: "TFSA vs RRSP: Which Comes First?", cat: "Investing", read: "7 min", excerpt: "The decision depends on your income, time horizon, and goals. Here's how to choose." },
  { title: "Sending Money to the Baltics: A Guide", cat: "Travel", read: "4 min", excerpt: "Everything you need to know about international transfers to Estonia and Latvia." },
  { title: "Co-op Apartment Insurance Explained", cat: "Insurance", read: "6 min", excerpt: "Why standard condo policies don't fit co-ops, and what coverage you actually need." },
  { title: "Building Your First Investment Portfolio", cat: "Investing", read: "8 min", excerpt: "A beginner's guide to ETFs, diversification, and getting started with C$100." },
  { title: "Estate Planning for New Parents", cat: "Estate", read: "5 min", excerpt: "Five things every new parent should do to protect their family's future." },
];
export default function Page() {
  return (
    <section style={{ background: C.cream, padding: "120px 16px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: F.sans, fontSize: 11, color: C.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Insights & Education</span>
          <h1 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "12px 0" }}>Financial wellness, explained</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {POSTS.map((p) => (
            <div key={p.title} style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #eee", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: C.accent, background: `${C.accent}10`, padding: "3px 10px", borderRadius: 8, fontWeight: 700 }}>{p.cat}</span>
                <span style={{ fontFamily: F.sans, fontSize: 11, color: "#bbb" }}>{p.read} read</span>
              </div>
              <h3 style={{ fontFamily: F.serif, fontSize: 19, color: C.navy, margin: "0 0 8px", lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ fontFamily: F.sans, fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0 }}>{p.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
