"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { colors as C, fonts as F } from "@/lib/theme";

export default function RegisterPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [branchId, setBranchId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/branches").then((r) => r.json()).then((d) => setBranches(d.branches ?? []));
  }, []);

  const submit = async () => {
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone: phone || undefined, password, branchId: branchId || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
      router.push("/dashboard");
    } catch {
      setError("Connection error"); setLoading(false);
    }
  };

  const input = { width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: "12px 16px", fontFamily: F.sans, fontSize: 14, boxSizing: "border-box" as const };
  const label = { fontFamily: F.sans, fontSize: 12, color: "#999", display: "block", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 16px 40px" }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 40, width: "100%", maxWidth: 480, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.birch}, ${C.navy})`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>NB</span>
          </div>
          <h1 style={{ fontFamily: F.serif, fontSize: 26, color: C.navy, margin: 0 }}>Become a member</h1>
          <p style={{ fontFamily: F.sans, fontSize: 13, color: "#999", margin: "8px 0 0" }}>Join 70 years of community banking</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div><label style={label}>First name</label><input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={input} /></div>
          <div><label style={label}>Last name</label><input value={lastName} onChange={(e) => setLastName(e.target.value)} style={input} /></div>
        </div>
        <div style={{ marginBottom: 14 }}><label style={label}>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={input} /></div>
        <div style={{ marginBottom: 14 }}><label style={label}>Phone (optional)</label><input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" style={input} /></div>
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Home branch (optional)</label>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} style={{ ...input, background: "#fff" }}>
            <option value="">Choose later...</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div><label style={label}>Password (8+ chars)</label><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" style={input} /></div>
          <div><label style={label}>Confirm password</label><input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" onKeyDown={(e) => e.key === "Enter" && submit()} style={input} /></div>
        </div>
        {error && <div style={{ background: `${C.red}10`, color: C.red, padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
        <button onClick={submit} disabled={loading || !firstName || !lastName || !email || !password} style={{ width: "100%", background: loading || !firstName || !email ? "#ccc" : C.accent, color: "#fff", border: "none", borderRadius: 12, padding: 14, fontFamily: F.sans, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
          {loading ? "Creating membership..." : "Create Membership"}
        </button>
        <p style={{ fontFamily: F.sans, fontSize: 12, color: "#999", textAlign: "center", margin: "0 0 10px" }}>
          Already a member? <Link href="/login" style={{ color: C.accent, fontWeight: 600 }}>Sign in</Link>
        </p>
        <p style={{ fontFamily: F.sans, fontSize: 10, color: "#bbb", textAlign: "center", lineHeight: 1.6, margin: 0 }}>
          By creating a membership you agree to our <Link href="/terms" style={{ color: C.accent }}>Terms of Use</Link> and <Link href="/privacy" style={{ color: C.accent }}>Privacy Policy</Link>. Identity verification (FINTRAC) is completed at any branch.
        </p>
      </div>
    </div>
  );
}
