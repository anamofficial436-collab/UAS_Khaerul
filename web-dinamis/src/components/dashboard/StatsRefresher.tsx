"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Komponen invisible yang me-refresh halaman setiap 60 detik
 * untuk memperbarui statistik dashboard secara otomatis.
 */
export default function StatsRefresher({ intervalMs = 60000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return null;
}
