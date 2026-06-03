import { queryOne } from "@/lib/db";
import { Pengaduan } from "@/types";

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import StatusBadge from "@/components/ui/StatusBadge";
import KategoriBadge from "@/components/ui/KategoriBadge";
import PrintButton from "./PrintButton";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  FileText,
  Clock,
  Hash,
  ImageOff,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DetailPengaduanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pengaduan = await queryOne<Pengaduan>(
    `SELECT * FROM pengaduan WHERE id = ?`,
    [id]
  );

  if (!pengaduan) notFound();

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/pengaduan"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Daftar
        </Link>
        <PrintButton />
      </div>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <StatusBadge status={pengaduan.status} />
          <KategoriBadge kategori={pengaduan.kategori} />
          <span className="ml-auto text-xs text-gray-400 font-mono flex items-center gap-1">
            <Hash size={11} />{pengaduan.id}
          </span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 leading-snug">
          {pengaduan.judul}
        </h1>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={<User size={15} className="text-primary-600" />} label="Nama Pelapor" value={pengaduan.nama} />
        <InfoCard icon={<Mail size={15} className="text-primary-600" />} label="Email" value={pengaduan.email} />
        <InfoCard icon={<Calendar size={15} className="text-primary-600" />} label="Tanggal Pengaduan" value={formatDate(pengaduan.created_at)} />
        <InfoCard icon={<Clock size={15} className="text-primary-600" />} label="Terakhir Diperbarui" value={formatDate(pengaduan.updated_at)} />
      </div>

      {/* Isi pengaduan */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={16} className="text-primary-600" />
          Isi Pengaduan
        </h3>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-5 border border-gray-100 text-sm">
          {pengaduan.isi}
        </div>
      </div>

      {/* ── FOTO BUKTI ── */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ImageOff size={16} className="text-primary-600" />
          Foto Bukti
        </h3>

        {pengaduan.foto ? (
          <div className="space-y-3">
            {/* Foto */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/uploads/${pengaduan.foto}`}
                alt={`Foto bukti pengaduan #${pengaduan.id}`}
                className="w-full max-h-96 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex flex-col items-center justify-center py-12 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        <p class="mt-2 text-sm">Foto tidak dapat dimuat</p>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            {/* Nama file */}
            <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
              <FileText size={12} />
              {pengaduan.foto}
            </p>
            {/* Download link */}
            <a
              href={`/uploads/${pengaduan.foto}`}
              download
              className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors"
            >
              ↓ Download foto bukti
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
            <ImageOff size={32} className="mb-2 opacity-40" />
            <p className="text-sm">Tidak ada foto bukti yang dilampirkan</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard/pengaduan" className="btn-secondary">
          <ArrowLeft size={15} />
          Kembali
        </Link>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
