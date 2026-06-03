import { query } from "@/lib/db";
import { Pengaduan, DashboardStats } from "@/types";
import StatsRefresher from "@/components/dashboard/StatsRefresher";

// Force dynamic rendering — halaman ini membutuhkan DB connection
export const dynamic = "force-dynamic";
import StatusBadge from "@/components/ui/StatusBadge";
import KategoriBadge from "@/components/ui/KategoriBadge";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  Loader,
  TrendingUp,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { formatDateShort } from "@/lib/utils";

async function getStats(): Promise<DashboardStats> {
  const rows = await query<{ status: string; count: number }>(
    `SELECT status, COUNT(*) as count FROM pengaduan GROUP BY status`
  );
  const stats: DashboardStats = { total: 0, menunggu: 0, diproses: 0, selesai: 0 };
  rows.forEach((r) => {
    const count = Number(r.count);
    stats.total += count;
    if (r.status === "menunggu") stats.menunggu = count;
    if (r.status === "diproses") stats.diproses = count;
    if (r.status === "selesai") stats.selesai = count;
  });
  return stats;
}

async function getRecentPengaduan(): Promise<Pengaduan[]> {
  return query<Pengaduan>(
    `SELECT id, nama, judul, kategori, status, created_at 
     FROM pengaduan ORDER BY created_at DESC LIMIT 5`
  );
}

export default async function DashboardPage() {
  const [stats, recentPengaduan] = await Promise.all([
    getStats(),
    getRecentPengaduan(),
  ]);

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Auto-refresh setiap 60 detik */}
      <StatsRefresher intervalMs={60000} />
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
            <Calendar size={13} />
            {today}
          </p>
        </div>
        <Link
          href="/dashboard/pengaduan"
          className="btn-primary text-sm py-2.5 px-4"
        >
          <FileText size={15} />
          Kelola Pengaduan
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Pengaduan"
          value={stats.total}
          icon={<FileText size={20} className="text-primary-600" />}
          iconBg="bg-primary-100"
          trend={stats.total > 0 ? "Semua kategori" : "Belum ada data"}
          trendColor="text-gray-500"
        />
        <StatCard
          title="Menunggu"
          value={stats.menunggu}
          icon={<Clock size={20} className="text-yellow-600" />}
          iconBg="bg-yellow-100"
          trend={`${stats.total > 0 ? Math.round((stats.menunggu / stats.total) * 100) : 0}% dari total`}
          trendColor="text-yellow-600"
        />
        <StatCard
          title="Diproses"
          value={stats.diproses}
          icon={<Loader size={20} className="text-blue-600" />}
          iconBg="bg-blue-100"
          trend={`${stats.total > 0 ? Math.round((stats.diproses / stats.total) * 100) : 0}% dari total`}
          trendColor="text-blue-600"
        />
        <StatCard
          title="Selesai"
          value={stats.selesai}
          icon={<CheckCircle size={20} className="text-green-600" />}
          iconBg="bg-green-100"
          trend={`${stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0}% dari total`}
          trendColor="text-green-600"
        />
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">
              Distribusi Status Pengaduan
            </h3>
            <span className="text-xs text-gray-400">{stats.total} total</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {stats.menunggu > 0 && (
              <div
                className="bg-yellow-400 transition-all"
                style={{ width: `${(stats.menunggu / stats.total) * 100}%` }}
                title={`Menunggu: ${stats.menunggu}`}
              />
            )}
            {stats.diproses > 0 && (
              <div
                className="bg-blue-500 transition-all"
                style={{ width: `${(stats.diproses / stats.total) * 100}%` }}
                title={`Diproses: ${stats.diproses}`}
              />
            )}
            {stats.selesai > 0 && (
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${(stats.selesai / stats.total) * 100}%` }}
                title={`Selesai: ${stats.selesai}`}
              />
            )}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400 inline-block" />
              Menunggu ({stats.menunggu})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
              Diproses ({stats.diproses})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />
              Selesai ({stats.selesai})
            </span>
          </div>
        </div>
      )}

      {/* Recent reports table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-600" />
            Pengaduan Terbaru
          </h3>
          <Link
            href="/dashboard/pengaduan"
            className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {recentPengaduan.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Belum ada pengaduan masuk.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-semibold">#</th>
                  <th className="px-6 py-3 text-left font-semibold">Pelapor</th>
                  <th className="px-6 py-3 text-left font-semibold">Judul</th>
                  <th className="px-6 py-3 text-left font-semibold">Kategori</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentPengaduan.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-gray-400 font-mono text-xs">
                      #{p.id}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-gray-900">
                      {p.nama}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 max-w-xs">
                      <span className="line-clamp-1">{p.judul}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <KategoriBadge kategori={p.kategori} />
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {formatDateShort(p.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  trend,
  trendColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  trend: string;
  trendColor: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-1">
        {value.toLocaleString()}
      </div>
      <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
    </div>
  );
}
