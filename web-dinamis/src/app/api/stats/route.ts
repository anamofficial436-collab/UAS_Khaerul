import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { DashboardStats, ApiResponse } from "@/types";

export async function GET() {
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
    return NextResponse.json<ApiResponse<DashboardStats>>({ success: true, data: stats });
  } catch (error) {
    console.error("[GET /api/stats]", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Gagal mengambil statistik" }, { status: 500 });
  }
}
