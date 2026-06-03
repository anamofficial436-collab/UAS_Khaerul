"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { KATEGORI_OPTIONS } from "@/lib/utils";
import { KategoriPengaduan } from "@/types";
import {
  FileText,
  User,
  Mail,
  Tag,
  AlignLeft,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ImagePlus,
  X,
} from "lucide-react";

interface FormData {
  nama: string;
  email: string;
  judul: string;
  kategori: KategoriPengaduan | "";
  isi: string;
}

interface FormErrors {
  nama?: string;
  email?: string;
  judul?: string;
  kategori?: string;
  isi?: string;
  foto?: string;
}

export default function PengaduanBaruPage() {
  const [form, setForm] = useState<FormData>({
    nama: "",
    email: "",
    judul: "",
    kategori: "",
    isi: "",
  });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Foto handler ──────────────────────────────────────────
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi client-side
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, foto: "Format tidak didukung. Gunakan JPG, PNG, atau WEBP." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, foto: "Ukuran foto maksimal 5MB." }));
      return;
    }

    setFotoFile(file);
    setErrors((prev) => ({ ...prev, foto: undefined }));

    // Buat preview
    const reader = new FileReader();
    reader.onloadend = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeFoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Validasi ─────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.nama.trim()) newErrors.nama = "Nama pelapor wajib diisi";
    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!form.judul.trim()) newErrors.judul = "Judul pengaduan wajib diisi";
    else if (form.judul.trim().length < 10)
      newErrors.judul = "Judul minimal 10 karakter";
    if (!form.kategori) newErrors.kategori = "Kategori wajib dipilih";
    if (!form.isi.trim()) newErrors.isi = "Isi pengaduan wajib diisi";
    else if (form.isi.trim().length < 30)
      newErrors.isi = "Isi pengaduan minimal 30 karakter";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");

    try {
      // Gunakan FormData untuk support file upload
      const fd = new FormData();
      fd.append("nama", form.nama);
      fd.append("email", form.email);
      fd.append("judul", form.judul);
      fd.append("kategori", form.kategori);
      fd.append("isi", form.isi);
      if (fotoFile) fd.append("foto", fotoFile);

      const res = await fetch("/api/pengaduan", {
        method: "POST",
        body: fd, // tidak set Content-Type — browser handle boundary otomatis
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setServerError(data.error || "Terjadi kesalahan. Coba lagi.");
      }
    } catch {
      setServerError("Gagal terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center animate-slide-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Pengaduan Berhasil Dikirim!
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Terima kasih telah melaporkan. Pengaduan Anda telah diterima dan
              akan segera diproses oleh tim kami dalam 3×24 jam.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({ nama: "", email: "", judul: "", kategori: "", isi: "" });
                  removeFoto();
                }}
                className="btn-secondary"
              >
                Buat Pengaduan Lain
              </button>
              <Link href="/" className="btn-primary">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Buat Pengaduan
          </h1>
          <p className="text-gray-500">
            Isi formulir di bawah dengan lengkap dan jelas agar pengaduan dapat
            segera ditindaklanjuti.
          </p>
        </div>

        {/* Info box */}
        <div className="flex gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl mb-6 text-sm text-primary-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-primary-500" />
          <div>
            <strong>Perhatian:</strong> Pastikan data yang Anda isi akurat dan
            sesuai kondisi nyata. Laporan palsu dapat dikenai sanksi hukum.
          </div>
        </div>

        {/* Form */}
        <div className="card p-8">
          {serverError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
              <AlertCircle size={16} />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5">
                  <User size={14} /> Nama Pelapor <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                className={`input-field ${errors.nama ? "border-red-400 focus:ring-red-500" : ""}`}
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
              />
              {errors.nama && <p className="mt-1.5 text-xs text-red-600">{errors.nama}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> Email <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="email"
                placeholder="contoh@email.com"
                className={`input-field ${errors.email ? "border-red-400 focus:ring-red-500" : ""}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Judul */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5">
                  <FileText size={14} /> Judul Pengaduan <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Tuliskan judul pengaduan secara singkat dan jelas"
                className={`input-field ${errors.judul ? "border-red-400 focus:ring-red-500" : ""}`}
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
              />
              {errors.judul && <p className="mt-1.5 text-xs text-red-600">{errors.judul}</p>}
            </div>

            {/* Kategori */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5">
                  <Tag size={14} /> Kategori <span className="text-red-500">*</span>
                </span>
              </label>
              <select
                className={`input-field ${errors.kategori ? "border-red-400 focus:ring-red-500" : ""}`}
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value as KategoriPengaduan })}
              >
                <option value="">-- Pilih Kategori --</option>
                {KATEGORI_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.kategori && <p className="mt-1.5 text-xs text-red-600">{errors.kategori}</p>}
            </div>

            {/* Isi */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5">
                  <AlignLeft size={14} /> Isi Pengaduan <span className="text-red-500">*</span>
                </span>
              </label>
              <textarea
                rows={6}
                placeholder="Jelaskan permasalahan yang ingin Anda laporkan secara detail. Sertakan lokasi, waktu kejadian, dan pihak yang terlibat jika ada."
                className={`input-field resize-none ${errors.isi ? "border-red-400 focus:ring-red-500" : ""}`}
                value={form.isi}
                onChange={(e) => setForm({ ...form, isi: e.target.value })}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.isi ? (
                  <p className="text-xs text-red-600">{errors.isi}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-gray-400">{form.isi.length} karakter</span>
              </div>
            </div>

            {/* ── FOTO BUKTI ── */}
            <div>
              <label className="label">
                <span className="flex items-center gap-1.5">
                  <ImagePlus size={14} /> Foto Bukti
                  <span className="text-xs font-normal text-gray-400 ml-1">(opsional · max 5MB · JPG/PNG/WEBP)</span>
                </span>
              </label>

              {/* Preview foto yang sudah dipilih */}
              {fotoPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoPreview}
                    alt="Preview foto bukti"
                    className="w-full max-h-64 object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={removeFoto}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors shadow"
                    >
                      <X size={12} />
                      Hapus Foto
                    </button>
                  </div>
                  <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-2">
                    <ImagePlus size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-500 truncate">{fotoFile?.name}</span>
                    <span className="text-xs text-gray-400 ml-auto shrink-0">
                      {fotoFile ? (fotoFile.size / 1024 / 1024).toFixed(2) + " MB" : ""}
                    </span>
                  </div>
                </div>
              ) : (
                /* Drop zone / Upload area */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-200
                    ${errors.foto
                      ? "border-red-300 bg-red-50 hover:border-red-400"
                      : "border-gray-200 bg-gray-50 hover:border-primary-400 hover:bg-primary-50"
                    }
                  `}
                >
                  <ImagePlus size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Klik untuk upload foto bukti
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG, WEBP — Maksimal 5MB
                  </p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFotoChange}
              />

              {errors.foto && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.foto}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Kirim Pengaduan
                  </>
                )}
              </button>
              <Link href="/" className="btn-secondary justify-center py-3 text-center">
                Batal
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
