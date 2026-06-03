"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import KategoriBadge from "@/components/ui/KategoriBadge";
import { Pengaduan } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Mail,
  FileText,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Inbox,
} from "lucide-react";
import Link from "next/link";

export default function CekStatusPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Pengaduan[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email wajib diisi"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch(
        `/api/pengaduan?email=${encodeURIComponent(email.trim())}&limit=20`
      );
      const data = await res.json();
      if (data.success) {
        setResults(data.data || []);
      } else {
        setError("Gagal mengambil data. Coba lagi.");
      }
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Cek Status Pengaduan
          </h1>
          <p className="text-gray-500">
            Masukkan email yang Anda gunakan saat membuat pengaduan untuk
            melihat status terkini.
          </p>
        </div>

        {/* Search form */}
        <div className="card p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="contoh@email.com"
                className={`input-field pl-10 ${error ? "border-red-400 focus:ring-red-500" : ""}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center px-6 py-3 disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Cari Pengaduan
            </button>
          </form>
          {error && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle size={14} />
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        {results !== null && (
          <div className="animate-slide-up">
            {results.length === 0 ? (
              <div className="card p-12 text-center">
                <Inbox size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-700 mb-1">
                  Tidak Ada Pengaduan
                </p>
                <p className="text-sm text-gray-400">
                  Tidak ditemukan pengaduan dengan email{" "}
                  <span className="font-medium">{email}</span>. Pastikan email
                  yang dimasukkan sesuai.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 font-medium">
                  Ditemukan{" "}
                  <span className="text-gray-900 font-bold">{results.length}</span>{" "}
                  pengaduan
                </p>
                {results.map((p) => (
                  <div key={p.id} className="card p-5 space-y-3">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={p.status} />
                        <KategoriBadge kategori={p.kategori} />
                      </div>
                      <span className="text-xs font-mono text-gray-400">
                        #{p.id}
                      </span>
                    </div>

                    {/* Judul */}
                    <h3 className="font-semibold text-gray-900">{p.judul}</h3>

                    {/* Isi preview */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {p.isi}
                    </p>

                    {/* Timeline */}
                    <div className="pt-3 border-t border-gray-50 flex flex-col sm:flex-row gap-1.5 text-xs text-gray-400">
                      <span>
                        Dikirim:{" "}
                        <span className="text-gray-600 font-medium">
                          {formatDate(p.created_at)}
                        </span>
                      </span>
                      {p.updated_at !== p.created_at && (
                        <>
                          <span className="hidden sm:inline">·</span>
                          <span>
                            Diperbarui:{" "}
                            <span className="text-gray-600 font-medium">
                              {formatDate(p.updated_at)}
                            </span>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Status explanation */}
                    <div className={`rounded-lg px-3 py-2 text-xs font-medium ${
                      p.status === "menunggu"
                        ? "bg-yellow-50 text-yellow-700"
                        : p.status === "diproses"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-green-50 text-green-700"
                    }`}>
                      {p.status === "menunggu" &&
                        "⏳ Pengaduan Anda sedang dalam antrian dan akan segera ditinjau."}
                      {p.status === "diproses" &&
                        "🔄 Pengaduan Anda sedang aktif diproses oleh tim terkait."}
                      {p.status === "selesai" &&
                        "✅ Pengaduan Anda telah selesai ditangani. Terima kasih!"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help box */}
        {results === null && (
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
            <FileText size={18} className="shrink-0 mt-0.5 text-blue-400" />
            <div>
              <strong>Tips:</strong> Gunakan email yang sama persis dengan yang
              Anda masukkan saat membuat pengaduan. Status pengaduan diperbarui
              secara real-time oleh tim kami.
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
