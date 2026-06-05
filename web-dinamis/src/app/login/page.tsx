"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Shield, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]           = useState({ username: "", password: "" });
  const [showPassword, setShow]   = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Login gagal");
      }
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "Inter, Segoe UI, system-ui, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <FileText size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "white", letterSpacing: "-0.03em", marginBottom: "4px" }}>
            LAPOR.ID
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
            Portal Administrasi
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          padding: "32px",
        }}>
          {/* Header card */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            marginBottom: "24px", paddingBottom: "20px",
            borderBottom: "1px solid #f1f5f9",
          }}>
            <div style={{
              width: "34px", height: "34px",
              background: "#eff6ff", borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Shield size={16} color="#1d4ed8" />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Login Admin</div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Masukkan kredensial Anda</div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "8px",
              padding: "10px 14px",
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "10px", marginBottom: "20px",
              fontSize: "13px", color: "#dc2626",
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Masukkan username"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                style={{
                  width: "100%", padding: "11px 14px",
                  borderRadius: "10px", border: "1px solid #e2e8f0",
                  fontSize: "14px", color: "#0f172a",
                  outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.style.borderColor = "#1d4ed8"}
                onBlur={(e)  => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: "100%", padding: "11px 42px 11px 14px",
                    borderRadius: "10px", border: "1px solid #e2e8f0",
                    fontSize: "14px", color: "#0f172a",
                    outline: "none", boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#1d4ed8"}
                  onBlur={(e)  => e.target.style.borderColor = "#e2e8f0"}
                />
                <button
                  type="button"
                  onClick={() => setShow(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#94a3b8", padding: "0",
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#93c5fd" : "#1e40af",
                color: "white", border: "none",
                borderRadius: "10px", fontSize: "14px", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                fontFamily: "inherit", transition: "background .2s",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                  Memverifikasi...
                </>
              ) : "Masuk ke Dashboard"}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>
              Halaman ini hanya untuk administrator resmi.
            </p>
            <Link href="/" style={{ fontSize: "12px", color: "#1d4ed8", textDecoration: "none" }}>
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "20px" }}>
          © 2024 LAPOR.ID — Sistem Pengaduan Masyarakat
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
}
