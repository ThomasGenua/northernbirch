"use client";

import { useState, useEffect } from "react";
import { colors as C, fonts as F } from "@/lib/theme";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Use a simple in-memory check; in production, read from a cookie (not localStorage per artifact rules)
    const consented = document.cookie.includes("nbcu_cookie_consent=");
    if (!consented) setShow(true);
  }, []);

  const accept = (essential: boolean) => {
    document.cookie = `nbcu_cookie_consent=${essential ? "essential" : "all"}; max-age=${60 * 60 * 24 * 365}; path=/`;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", bottom: 16, left: 16, right: 16, maxWidth: 720, margin: "0 auto",
      background: "#fff", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      padding: 20, zIndex: 2500, fontFamily: F.sans,
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, justifyContent: "space-between",
    }}>
      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: 0, flex: "1 1 320px" }}>
        We use cookies to provide secure banking and improve your experience. See our{" "}
        <a href="/privacy" style={{ color: C.accent, fontWeight: 600 }}>Privacy Policy</a> for details.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => accept(true)} style={{ background: "#f5f5f5", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: C.navy, fontWeight: 600 }}>Essential Only</button>
        <button onClick={() => accept(false)} style={{ background: C.accent, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, color: "#fff", fontWeight: 600 }}>Accept All</button>
      </div>
    </div>
  );
}
