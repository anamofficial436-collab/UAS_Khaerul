import Link from "next/link";
import { FileText, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center">
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <div className="font-extrabold text-lg tracking-tight">LAPOR.ID</div>
                <div className="text-[10px] text-primary-300 font-medium tracking-wider uppercase">
                  Pengaduan Masyarakat
                </div>
              </div>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed">
              Platform pengaduan masyarakat digital yang transparan, responsif,
              dan terpercaya. Suara Anda adalah prioritas kami.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                ● Sistem Online
              </span>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-primary-300 mb-4">
              Layanan
            </h3>
            <ul className="space-y-2.5 text-sm text-primary-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/pengaduan-baru" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Buat Pengaduan
                </Link>
              </li>
              <li>
                <Link href="/cek-status" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Cek Status Pengaduan
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Portal Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-primary-300 mb-4">
              Kategori Pengaduan
            </h3>
            <ul className="space-y-2.5 text-sm text-primary-200">
              {[
                "Infrastruktur",
                "Lingkungan",
                "Keamanan",
                "Pelayanan Publik",
                "Sosial",
              ].map((k) => (
                <li key={k} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary-400" />
                  {k}
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-primary-300 mb-4">
              Kontak
            </h3>
            <ul className="space-y-3 text-sm text-primary-200">
              <li className="flex items-center gap-2">
                <Phone size={13} className="shrink-0 text-primary-400" />
                <span>0800-1234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="shrink-0 text-primary-400" />
                <span>lapor@pemda.go.id</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={13} className="shrink-0 mt-0.5 text-primary-400" />
                <span>Jl. Merdeka No. 1,<br />Jakarta Pusat 10110</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink size={13} className="shrink-0 text-primary-400" />
                <a href="#" className="hover:text-white transition-colors">
                  lapor.go.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-400">
          <span>© {year} LAPOR.ID — Hak Cipta Dilindungi Undang-Undang</span>
          <div className="flex items-center gap-4">
            <span>Dibangun dengan Next.js & MariaDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
