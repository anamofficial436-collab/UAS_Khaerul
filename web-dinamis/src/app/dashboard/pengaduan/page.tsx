import { query } from "@/lib/db";
import { Pengaduan } from "@/types";

export const dynamic = "force-dynamic";

import StatusBadge from "@/components/ui/StatusBadge";
import KategoriBadge from "@/components/ui/KategoriBadge";
import Pagination from "@/components/ui/Pagination";
import PengaduanActions from "./PengaduanActions";
import PengaduanSearch from "@/components/dashboard/PengaduanSearch";
import Link from "next/link";
import { FileText, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";

interface SearchParams {
  status?: string;
  kategori?: string;
  page?: string;
  q?: string;
}

const PAGE_SIZE = 10;

const VALID_STATUS = ["menunggu", "diproses", "selesai"];
const VALID_KATEGORI = ["infrastruktur", "lingkungan", "keamanan", "pelayanan_publik", "sosial", "lainnya"];

async function getPengaduan(
  status?: string,
  kategori?: string,
  q?: string,
  page = 1
): Promise<{ data: Pengaduan[]; total: number }> {
  const conditions: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any[] = [];

  if (status && VALID_STATUS.includes(status)) {
    conditions.push("status = ?");
    params.push(status);
  }
  if (kategori && VALID_KATEGORI.includes(kategori)) {
    conditions.push("kategori = ?");
    params.push(kategori);
  }
  if (q?.trim()) {
    conditions.push("(nama LIKE ? OR judul LIKE ? OR email LIKE ?)");
    const keyword = `%${q.trim()}%`;
    params.push(keyword, keyword, keyword);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * PAGE_SIZE;

  const [data, countRows] = await Promise.all([
    query<Pengaduan>(
      `SELECT id, nama, email, judul, kategori, isi, status, created_at, updated_at
       FROM pengaduan ${where} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
      params.length > 0 ? params : undefined
    ),
    query<{ total: number }>(
      `SELECT COUNT(*) as total FROM pengaduan ${where}`,
      params.length > 0 ? params : undefined
    ),
  ]);

  return { data, total: Number(countRows[0]?.total || 0) };
}

export default async function PengaduanPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentStatus = params.status || "";
  const currentKategori = params.kategori || "";
  const currentPage = parseInt(params.page || "1");
  const currentQ = params.q || "";

  const { data: pengaduanList, total } = await getPengaduan(
    currentStatus, currentKategori, currentQ, currentPage
  );
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams({
      ...(currentStatus && { status: currentStatus }),
      ...(currentKategori && { kategori: currentKategori }),
      ...(currentQ && { q: currentQ }),
      page: "1",
      ...overrides,
    });
    return `/dashboard/pengaduan?${p.toString()}`;
  };

  const csvUrl = `/api/export/csv${
    currentStatus || currentKategori
      ? `?${new URLSearchParams({
          ...(currentStatus && { status: currentStatus }),
          ...(currentKategori && { kategori: currentKategori }),
        }).toString()}`
      : ""
  }`;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengaduan</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} pengaduan{currentQ && ` untuk "${currentQ}"`}
          </p>
        </div>
        <a
          href={csvUrl}
          download
          className="btn-secondary text-sm py-2 px-4 self-start sm:self-auto"
        >
          ↓ Export CSV
        </a>
      </div>

      {/* Filters + Search */}
      <div className="card p-4 space-y-3">
        {/* Search */}
        <Suspense>
          <PengaduanSearch />
        </Suspense>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
            <Filter size={12} /> Status:
          </span>
          {[
            { label: "Semua", value: "" },
            { label: "Menunggu", value: "menunggu" },
            { label: "Diproses", value: "diproses" },
            { label: "Selesai", value: "selesai" },
          ].map((opt) => (
            <Link
              key={opt.value}
              href={buildUrl({ status: opt.value, page: "1" })}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                currentStatus === opt.value
                  ? "bg-primary-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </Link>
          ))}

          <span className="hidden sm:block w-px h-4 bg-gray-200 mx-1" />

          <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
            <Filter size={12} /> Kategori:
          </span>
          {[
            { label: "Semua", value: "" },
            { label: "Infrastruktur", value: "infrastruktur" },
            { label: "Lingkungan", value: "lingkungan" },
            { label: "Keamanan", value: "keamanan" },
            { label: "Pelayanan Publik", value: "pelayanan_publik" },
            { label: "Sosial", value: "sosial" },
            { label: "Lainnya", value: "lainnya" },
          ].map((opt) => (
            <Link
              key={opt.value}
              href={buildUrl({ kategori: opt.value, page: "1" })}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                currentKategori === opt.value
                  ? "bg-primary-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {pengaduanList.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-500">Tidak ada pengaduan ditemukan</p>
            {(currentStatus || currentKategori || currentQ) && (
              <Link href="/dashboard/pengaduan" className="mt-3 inline-block text-sm text-primary-600 hover:underline">
                Reset filter
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold">#ID</th>
                  <th className="px-5 py-3 text-left font-semibold">Pelapor</th>
                  <th className="px-5 py-3 text-left font-semibold">Judul</th>
                  <th className="px-5 py-3 text-left font-semibold">Kategori</th>
                  <th className="px-5 py-3 text-left font-semibold">Foto</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                  <th className="px-5 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-5 py-3 text-left font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pengaduanList.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">#{p.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900 text-sm">{p.nama}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[140px]">{p.email}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <span className="text-gray-700 line-clamp-2 text-sm leading-snug">{p.judul}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <KategoriBadge kategori={p.kategori} />
                    </td>
                    <td className="px-5 py-3.5">
                      {p.foto ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={`/uploads/${p.foto}`}
                          alt="foto bukti"
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                          title="Klik detail untuk lihat penuh"
                        />
                      ) : (
                        <span className="text-xs text-gray-300 italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <PengaduanActions pengaduan={p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
        buildUrl={(page) => buildUrl({ page: String(page) })}
      />
    </div>
  );
}
