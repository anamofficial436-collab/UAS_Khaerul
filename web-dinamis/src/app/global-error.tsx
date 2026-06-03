"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="font-sans antialiased bg-gray-50">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={36} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Terjadi Kesalahan
            </h1>
            <p className="text-gray-500 mb-2 leading-relaxed">
              Aplikasi mengalami kesalahan yang tidak terduga. Tim kami telah
              diberitahu dan sedang menyelidiki masalah ini.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-400 mb-6 font-mono">
                Error ID: {error.digest}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-800 transition-colors"
              >
                <RefreshCw size={15} />
                Coba Lagi
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
              >
                <Home size={15} />
                Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
