import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Pengaduan, ApiResponse } from "@/types";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ============================================================
// GET /api/pengaduan - List pengaduan (public)
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");
    const email = searchParams.get("email");

    const conditions: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any[] = [];

    if (status && ["menunggu", "diproses", "selesai"].includes(status)) {
      conditions.push("status = ?");
      params.push(status);
    }
    if (email?.trim()) {
      conditions.push("email = ?");
      params.push(email.trim().toLowerCase());
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT id, nama, email, judul, kategori, isi, foto, status, created_at, updated_at
                 FROM pengaduan ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const data = await query<Pengaduan>(sql, params.length > 0 ? params : undefined);

    return NextResponse.json<ApiResponse<Pengaduan[]>>({ success: true, data });
  } catch (error) {
    console.error("[GET /api/pengaduan]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal mengambil data pengaduan" },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/pengaduan - Submit pengaduan baru (dengan foto)
// Menerima multipart/form-data
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const judul = formData.get("judul") as string;
    const kategori = formData.get("kategori") as string;
    const isi = formData.get("isi") as string;
    const fotoFile = formData.get("foto") as File | null;

    // Validasi field wajib
    if (!nama?.trim() || !email?.trim() || !judul?.trim() || !kategori || !isi?.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const validKategori = ["infrastruktur", "lingkungan", "keamanan", "pelayanan_publik", "sosial", "lainnya"];
    if (!validKategori.includes(kategori)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Kategori tidak valid" },
        { status: 400 }
      );
    }

    if (judul.trim().length < 10) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Judul minimal 10 karakter" },
        { status: 400 }
      );
    }

    if (isi.trim().length < 30) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Isi pengaduan minimal 30 karakter" },
        { status: 400 }
      );
    }

    // ── Handle upload foto ──────────────────────────────────
    let fotoFilename: string | null = null;

    if (fotoFile && fotoFile.size > 0) {
      // Validasi tipe file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(fotoFile.type)) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Format foto tidak didukung. Gunakan JPG, PNG, atau WEBP." },
          { status: 400 }
        );
      }

      // Validasi ukuran file (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (fotoFile.size > maxSize) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Ukuran foto maksimal 5MB." },
          { status: 400 }
        );
      }

      // Buat nama file unik
      const ext = fotoFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      fotoFilename = `pengaduan-${timestamp}-${random}.${ext}`;

      // Simpan file ke public/uploads/
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await fotoFile.arrayBuffer());
      await writeFile(path.join(uploadDir, fotoFilename), buffer);
    }

    // Simpan ke database
    await query(
      `INSERT INTO pengaduan (nama, email, judul, kategori, isi, foto, status)
       VALUES (?, ?, ?, ?, ?, ?, 'menunggu')`,
      [nama.trim(), email.trim().toLowerCase(), judul.trim(), kategori, isi.trim(), fotoFilename]
    );

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Pengaduan berhasil dikirim" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/pengaduan]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal menyimpan pengaduan" },
      { status: 500 }
    );
  }
}
