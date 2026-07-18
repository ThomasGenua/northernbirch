"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";
import { t } from "@/lib/i18n";
import type { Lang } from "@/types";

const NAV_ITEMS = [
  { label: "Personal", href: "/personal" },
  { label: "Invest", href: "/invest" },
  { label: "Insurance", href: "/insurance" },
  { label: "Travel", href: "/travel" },
  { label: "Business", href: "/business" },
  { label: "Tools", href: "/quote" },
  { label: "Rates", href: "/rates" },
] as const;

export default function Nav({ lang, setLang, onSearch, onNotifications }: { lang: Lang; setLang: (l: Lang) => void; onSearch: () => void; onNotifications: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  const isMobile = width <= 900;
  const isHome = pathname === "/";
  const isDark = isHome && !scrolled && !mobileOpen;
  const langLabels: Record<Lang, string> = { en: "EN", est: "EST", lat: "LAT" };
  const langFull: Record<Lang, string> = { en: "English", est: "Eesti", lat: "Latviešu" };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: isDark ? "transparent" : "rgba(253,251,247,0.98)",
        backdropFilter: isDark ? "none" : "blur(16px)",
        transition: "all 0.4s",
        borderBottom: isDark ? "none" : "1px solid rgba(200,184,138,0.15)",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: isMobile ? "10px 16px" : "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.birch}, ${C.navy})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>NB</span>
            </div>
            <div>
              <span style={{ fontFamily: F.serif, fontSize: isMobile ? 14 : 16, color: isDark ? "#fff" : C.navy, fontWeight: 600, display: "block", lineHeight: 1.2 }}>Northern Birch</span>
              {!isMobile && <span style={{ fontFamily: F.sans, fontSize: 9.5, color: isDark ? "rgba(255,255,255,0.5)" : "#999", letterSpacing: 1, textTransform: "uppercase" }}>{t("Credit Union", lang)}</span>}
            </div>
          </Link>
          {!isMobile ? (
            <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
              {NAV_ITEMS.map((n) => (
                <Link key={n.href} href={n.href as never} style={{
                  background: pathname === n.href ? `${C.accent}10` : "transparent", border: "none",
                  color: pathname === n.href ? C.accent : (isDark ? "rgba(255,255,255,0.8)" : C.navy),
                  padding: "8px 10px", borderRadius: 8, fontSize: 12, fontFamily: F.sans,
                  fontWeight: pathname === n.href ? 700 : 500,
                }}>{t(n.label, lang)}</Link>
              ))}
              <div style={{ width: 1, height: 20, background: isDark ? "rgba(255,255,255,0.15)" : "#ddd", margin: "0 6px" }} />
              <button onClick={onSearch} title="Search (Cmd+K)" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, fontSize: 15, color: isDark ? "rgba(255,255,255,0.7)" : "#888" }}>🔍</button>
              <button onClick={onNotifications} title="Notifications" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, fontSize: 15, color: isDark ? "rgba(255,255,255,0.7)" : "#888", position: "relative" }}>
                🔔<span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: C.red, border: `2px solid ${isDark ? C.navy : C.cream}` }} />
              </button>
              <div style={{ position: "relative" }}>
                <button onClick={() => setLangOpen(!langOpen)} style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "#f5f5f5", border: "none", borderRadius: 8,
                  padding: "6px 12px", fontFamily: F.sans, fontSize: 11, color: isDark ? "rgba(255,255,255,0.7)" : C.navy, fontWeight: 700,
                }}>🌐 {langLabels[lang]}</button>
                {langOpen && (
                  <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: 140 }}>
                    {(Object.entries(langFull) as [Lang, string][]).map(([code, name]) => (
                      <button key={code} onClick={() => { setLang(code); setLangOpen(false); }} style={{
                        display: "block", width: "100%", textAlign: "left",
                        background: lang === code ? `${C.accent}08` : "#fff", border: "none",
                        padding: "10px 16px", fontFamily: F.sans, fontSize: 13,
                        color: lang === code ? C.accent : C.navy, fontWeight: lang === code ? 700 : 400,
                      }}><span style={{ fontWeight: 700, marginRight: 8 }}>{langLabels[code]}</span>{name}</button>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/login" style={{ background: C.accent, border: "none", borderRadius: 8, padding: "7px 16px", fontFamily: F.sans, fontSize: 12, color: "#fff", fontWeight: 600 }}>{t("Sign In", lang)}</Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={onSearch} style={{ background: "none", border: "none", padding: 6, fontSize: 16, color: isDark ? "#fff" : C.navy }}>🔍</button>
              <button onClick={onNotifications} style={{ background: "none", border: "none", padding: 6, fontSize: 16, color: isDark ? "#fff" : C.navy, position: "relative" }}>
                🔔<span style={{ position: "absolute", top: 2, right: 2, width: 6, height: 6, borderRadius: "50%", background: C.red }} />
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", padding: 8, fontSize: 20, color: isDark ? "#fff" : C.navy }}>{mobileOpen ? "✕" : "☰"}</button>
            </div>
          )}
        </div>
      </nav>
      {isMobile && mobileOpen && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, background: "rgba(253,251,247,0.99)", zIndex: 999, padding: 16, overflow: "auto" }}>
          {NAV_ITEMS.map((n) => (
            <Link key={n.href} href={n.href as never} onClick={() => setMobileOpen(false)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: pathname === n.href ? `${C.accent}10` : "transparent", border: "none",
              padding: "16px 20px", borderRadius: 12, fontFamily: F.sans, fontSize: 16,
              color: pathname === n.href ? C.accent : C.navy, fontWeight: pathname === n.href ? 700 : 500, marginBottom: 4,
            }}>{t(n.label, lang)}</Link>
          ))}
          <div style={{ borderTop: "1px solid #eee", marginTop: 12, paddingTop: 12 }}>
            <Link href="/login" onClick={() => setMobileOpen(false)} style={{ display: "block", width: "100%", textAlign: "center", background: C.accent, border: "none", borderRadius: 12, padding: 14, fontFamily: F.sans, fontSize: 15, color: "#fff", fontWeight: 700, marginBottom: 8 }}>{t("Sign In", lang)}</Link>
            <Link href="/booking" onClick={() => setMobileOpen(false)} style={{ display: "block", width: "100%", textAlign: "center", background: C.navy, border: "none", borderRadius: 12, padding: 14, fontFamily: F.sans, fontSize: 15, color: "#fff", fontWeight: 700 }}>{t("Book Appointment", lang)}</Link>
          </div>
        </div>
      )}
    </>
  );
}
