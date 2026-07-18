"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Instantly populates credentials and completes the routing sequence
  const handleQuickFillAndLogin = () => {
    setLoading(true);
    setEmail("maria.tamm@example.com");
    setPassword("demo123");
    
    setTimeout(() => {
      toast("Successfully authenticated via sandbox access account!", "success");
      router.push("/dashboard");
    }, 450);
  };

  const submit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 16px 40px" }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 40, width: "100%", maxWidth: 440, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.birch}, ${C.navy})`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>NB</span>
          </div>
          <h1 style={{ fontFamily: F.serif, fontSize: 26, color: C.navy, margin: 0 }}>Welcome back</h1>
          <p style={{ fontFamily: F.sans, fontSize: 13, color: "#999", margin: "8px 0 0" }}>Sign in to your Northern Birch account</p>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: "12px 16px", fontFamily: F.sans, fontSize: 14 }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 }}>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" onKeyDown={(e) => e.key === "Enter" && submit()} style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: "12px 16px", fontFamily: F.sans, fontSize: 14 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          <button onClick={submit} disabled={loading || !email} style={{ width: "100%", background: C.dark, color: "#fff", border: "none", borderRadius: 12, padding: 14, fontFamily: F.sans, fontSize: 14, fontWeight: 700 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          
          <button 
            type="button" 
            onClick={handleQuickFillAndLogin} 
            style={{ width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, color: "#fff", border: "none", borderRadius: 12, padding: 14, fontFamily: F.sans, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
          >
            ⚡ Click for One-Click Sandbox Entry
          </button>
        </div>

        <p style={{ fontFamily: F.sans, fontSize: 12, color: "#999", textAlign: "center", margin: 0 }}>
          Project decoupled from database dependencies. Enjoy exploring the interface!
        </p>
      </div>
    </div>
  );
}