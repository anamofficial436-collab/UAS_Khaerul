import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/test-db — cek koneksi database (untuk debugging)
export async function GET() {
  const config = {
    host:     process.env.DB_HOST     || "(tidak ada)",
    port:     process.env.DB_PORT     || "(tidak ada)",
    user:     process.env.DB_USER     || "(tidak ada)",
    database: process.env.DB_NAME     || "(tidak ada)",
    password: process.env.DB_PASSWORD ? "***ada***" : "(kosong)",
  };

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute("SELECT COUNT(*) as total FROM users");
    conn.release();

    return NextResponse.json({
      status: "✅ KONEKSI BERHASIL",
      config,
      users_count: (rows as { total: number }[])[0].total,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      status: "❌ KONEKSI GAGAL",
      error: msg,
      config,
    }, { status: 500 });
  }
}
