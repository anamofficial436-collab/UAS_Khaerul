import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Pengaduan } from "@/types";

// GET /api/export/csv - Export semua pengaduan ke CSV (admin only)
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const kategori = searchParams.get("kategori") || "";

    const conditions: string[] = [];
    const params: string[] = [];

    if (status && ["menunggu", "diproses", "selesai"].includes(status)) {
      conditions.push("status = ?");
      params.push(status);
    }

    if (kategori && ["infrastruktur", "lingkungan", "keamanan", "pelayanan_publik", "sosial", "lainnya"].includes(kategori)) {
      conditions.push("kategori = ?");
      params.push(kategori);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const data = await query<Pengaduan>(
      `SELECT id, nama, email, judul, kategori, isi, status, created_at, updated_at
       FROM pengaduan ${where} ORDER BY created_at DESC`,
      params.length > 0 ? params : undefined
    );

    // Build CSV
    const headers = [
      "ID", "Nama", "Email", "Judul", "Kategori", "Status",
      "Tanggal Dibuat", "Terakhir Diperbarui", "Isi Pengaduan"
    ];

    const escapeCSV = (val: string | number) => {
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = data.map((p) => [
      p.id,
      p.nama,
      p.email,
      p.judul,
      p.kategori,
      p.status,
      new Date(p.created_at).toLocaleString("id-ID"),
      new Date(p.updated_at).toLocaleString("id-ID"),
      p.isi.replace(/\n/g, " "),
    ].map(escapeCSV).join(","));

    const csv = [headers.join(","), ...rows].join("\n");

    // BOM untuk Excel compatibility dengan karakter Indonesia
    const bom = "\uFEFF";
    const csvWithBom = bom + csv;

    const filename = `pengaduan-lapor-id-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[GET /api/export/csv]", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengekspor data" },
      { status: 500 }
    );
  }
}
