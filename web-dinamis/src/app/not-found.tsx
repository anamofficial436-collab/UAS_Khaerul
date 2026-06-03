import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-slide-up">
        {/* Illustration */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
            <FileQuestion size={52} className="text-primary-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-black text-white text-lg shadow-lg">
            ?
          </div>
        </div>

        {/* Text */}
        <h1 className="text-6xl font-black text-primary-800 mb-3 tracking-tight">
          404
        </h1>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          Periksa kembali URL yang Anda masukkan.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home size={16} />
            Kembali ke Beranda
          </Link>
          <Link href="javascript:history.back()" className="btn-secondary">
            <ArrowLeft size={16} />
            Halaman Sebelumnya
          </Link>
        </div>
      </div>
    </div>
  );
}
