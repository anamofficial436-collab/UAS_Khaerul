"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Gagal Memuat Halaman
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Terjadi kesalahan saat mengambil data. Periksa koneksi database dan
          coba lagi.
        </p>
        {error.message && (
          <p className="text-xs bg-red-50 text-red-700 border border-red-100 rounded-lg p-3 mb-5 font-mono text-left">
            {error.message}
          </p>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-800 transition-colors text-sm"
        >
          <RefreshCw size={15} />
          Muat Ulang
        </button>
      </div>
    </div>
  );
}
