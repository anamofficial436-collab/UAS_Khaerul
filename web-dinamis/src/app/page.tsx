import Link from "next/link";
import { query } from "@/lib/db";
import { Pengaduan, DashboardStats } from "@/types";

export const dynamic = "force-dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import KategoriBadge from "@/components/ui/KategoriBadge";
import {
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Loader,
  Users,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { formatDateShort, truncate } from "@/lib/utils";

async function getStats(): Promise<DashboardStats> {
  try {
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
  } catch {
    return { total: 0, menunggu: 0, diproses: 0, selesai: 0 };
  }
}

async function getRecentPengaduan(): Promise<Pengaduan[]> {
  try {
    return await query<Pengaduan>(
      `SELECT id, nama, email, judul, kategori, isi, status, created_at, updated_at 
       FROM pengaduan ORDER BY created_at DESC LIMIT 6`
    );
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [stats, recentPengaduan] = await Promise.all([getStats(), getRecentPengaduan()]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              <ShieldCheck size={14} />
              Platform Resmi Pengaduan Masyarakat
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Suara Anda,
              <br />
              <span className="text-yellow-300">Prioritas Kami</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed mb-10 max-w-2xl">
              Laporkan permasalahan di lingkungan Anda secara langsung kepada
              pihak berwenang. Transparan, cepat, dan dapat dipantau secara
              real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/pengaduan-baru"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-yellow-400 text-primary-900 font-bold rounded-xl hover:bg-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-base"
              >
                <FileText size={18} />
                Buat Pengaduan Sekarang
                <ArrowRight size={16} />
              </Link>
              <a
                href="#pengaduan-terbaru"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-200 backdrop-blur-sm text-base"
              >
                Lihat Pengaduan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              icon={<FileText size={22} className="text-primary-600" />}
              label="Total Pengaduan"
              value={stats.total}
              color="bg-primary-50"
            />
            <StatCard
              icon={<Clock size={22} className="text-yellow-600" />}
              label="Menunggu"
              value={stats.menunggu}
              color="bg-yellow-50"
            />
            <StatCard
              icon={<Loader size={22} className="text-blue-600" />}
              label="Diproses"
              value={stats.diproses}
              color="bg-blue-50"
            />
            <StatCard
              icon={<CheckCircle size={22} className="text-green-600" />}
              label="Selesai"
              value={stats.selesai}
              color="bg-green-50"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Mengapa LAPOR.ID?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Kami hadir untuk memastikan setiap suara masyarakat didengar dan
              ditindaklanjuti dengan serius.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck className="text-primary-600" size={24} />,
                title: "Transparan & Terpercaya",
                desc: "Setiap pengaduan dapat dipantau perkembangannya secara real-time oleh pelapor.",
              },
              {
                icon: <TrendingUp className="text-green-600" size={24} />,
                title: "Penanganan Cepat",
                desc: "Tim kami berkomitmen menindaklanjuti setiap laporan dalam waktu 3x24 jam.",
              },
              {
                icon: <Users className="text-blue-600" size={24} />,
                title: "Untuk Semua Masyarakat",
                desc: "Layanan pengaduan tersedia untuk seluruh lapisan masyarakat tanpa terkecuali.",
              },
            ].map((f, i) => (
              <div key={i} className="card p-6 animate-slide-up">
                <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center mb-4 border border-gray-100">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reports */}
      <section id="pengaduan-terbaru" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Pengaduan Terbaru
              </h2>
              <p className="text-gray-500 text-sm">
                Laporan yang baru masuk dari masyarakat
              </p>
            </div>
            <Link
              href="/pengaduan-baru"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
            >
              Buat Laporan
              <ChevronRight size={16} />
            </Link>
          </div>

          {recentPengaduan.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText size={40} className="mx-auto mb-3 opacity-40" />
              <p>Belum ada pengaduan yang masuk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentPengaduan.map((p) => (
                <div
                  key={p.id}
                  className="card-hover p-5 flex flex-col gap-3 animate-slide-up"
                >
                  <div className="flex items-start justify-between gap-2">
                    <StatusBadge status={p.status} />
                    <KategoriBadge kategori={p.kategori} />
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                    {p.judul}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {truncate(p.isi, 140)}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{p.nama}</span>
                    <span>{formatDateShort(p.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-800 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ada yang ingin dilaporkan?
          </h2>
          <p className="text-primary-200 mb-8">
            Jangan ragu untuk menyampaikan pengaduan Anda. Setiap laporan akan
            ditangani oleh tim profesional kami.
          </p>
          <Link
            href="/pengaduan-baru"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-yellow-400 text-primary-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg text-base"
          >
            <FileText size={18} />
            Mulai Pengaduan
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-gray-100">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-extrabold text-gray-900">{value.toLocaleString()}</div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
      </div>
    </div>
  );
}
