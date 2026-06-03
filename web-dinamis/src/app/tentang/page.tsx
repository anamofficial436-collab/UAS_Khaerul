import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Shield,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  Building2,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Tentang Kami — LAPOR.ID",
  description:
    "LAPOR.ID adalah platform pengaduan masyarakat digital milik pemerintah yang transparan dan terpercaya.",
};

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-700 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Building2 size={14} />
            Platform Resmi Pemerintah
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Tentang LAPOR.ID
          </h1>
          <p className="text-xl text-primary-100 leading-relaxed max-w-2xl mx-auto">
            Kami hadir untuk menjembatani aspirasi masyarakat dengan tanggung
            jawab pemerintah. Setiap pengaduan adalah langkah menuju Indonesia
            yang lebih baik.
          </p>
        </div>
      </section>

      {/* Misi */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={28} className="text-primary-600" />,
                bg: "bg-primary-50",
                title: "Visi",
                desc: "Menjadi platform pengaduan masyarakat terpercaya yang mendorong transparansi dan akuntabilitas penyelenggaraan pemerintahan di seluruh Indonesia.",
              },
              {
                icon: <Star size={28} className="text-yellow-500" />,
                bg: "bg-yellow-50",
                title: "Misi",
                desc: "Menyediakan kanal pengaduan yang mudah, cepat, dan dapat dipantau oleh seluruh lapisan masyarakat tanpa birokrasi yang rumit.",
              },
              {
                icon: <TrendingUp size={28} className="text-green-600" />,
                bg: "bg-green-50",
                title: "Nilai",
                desc: "Transparansi, integritas, responsif, dan berorientasi pada kepuasan masyarakat menjadi fondasi dalam setiap proses penanganan pengaduan.",
              },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Cara Kerja</h2>
            <p className="text-gray-500">Proses pengaduan yang sederhana, transparan, dan terukur</p>
          </div>
          <div className="space-y-4">
            {[
              {
                step: "01",
                icon: <FileText size={20} className="text-primary-600" />,
                title: "Buat Pengaduan",
                desc: "Isi formulir pengaduan dengan data yang akurat. Sertakan judul, kategori, dan uraian permasalahan secara detail.",
                color: "bg-primary-50 border-primary-100",
              },
              {
                step: "02",
                icon: <Clock size={20} className="text-yellow-600" />,
                title: "Pengaduan Diverifikasi",
                desc: "Tim kami akan meninjau dan memverifikasi pengaduan Anda dalam 1×24 jam untuk memastikan keabsahan laporan.",
                color: "bg-yellow-50 border-yellow-100",
              },
              {
                step: "03",
                icon: <Users size={20} className="text-blue-600" />,
                title: "Ditindaklanjuti",
                desc: "Pengaduan yang valid akan diteruskan kepada instansi terkait dan ditangani oleh petugas yang berwenang.",
                color: "bg-blue-50 border-blue-100",
              },
              {
                step: "04",
                icon: <CheckCircle size={20} className="text-green-600" />,
                title: "Selesai & Terpantau",
                desc: "Pelapor dapat memantau perkembangan status pengaduan secara real-time melalui fitur Cek Status.",
                color: "bg-green-50 border-green-100",
              },
            ].map((item, i) => (
              <div key={i} className={`card border p-5 flex items-start gap-4 ${item.color}`}>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-black text-gray-400 shadow-sm border border-gray-100">
                    {item.step}
                  </span>
                  {i < 3 && <div className="w-px h-6 bg-gray-200" />}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teknologi */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Dibangun dengan Teknologi Modern
          </h2>
          <p className="text-gray-500 mb-10">
            Platform kami menggunakan teknologi terkini untuk memastikan
            keamanan, kecepatan, dan keandalan sistem.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 15", "TypeScript", "Tailwind CSS",
              "MariaDB", "Docker", "GitHub Actions",
              "AWS EC2", "iron-session", "bcrypt",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-semibold border border-primary-100"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ada permasalahan yang ingin Anda laporkan?
          </h2>
          <p className="text-primary-200 mb-8 text-sm">
            Jangan ragu — setiap laporan Anda akan ditangani dengan serius.
          </p>
          <Link
            href="/pengaduan-baru"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-400 text-primary-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors shadow-lg text-base"
          >
            <FileText size={18} />
            Buat Pengaduan Sekarang
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
