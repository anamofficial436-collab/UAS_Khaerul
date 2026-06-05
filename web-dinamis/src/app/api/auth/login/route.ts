import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ApiResponse, User } from "@/types";
import bcrypt from "bcrypt";

interface UserWithPassword extends User {
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username?.trim() || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // 1. BYPASS KHUSUS ADMIN UTAMA UNTUK UAS KHAERUL
    if (username.trim() === "admin" && password === "admin123") {
      // Buat session langsung tanpa cek database/bcrypt
      const session = await getSession();
      session.userId   = 1; // Set default ID admin
      session.username = "admin";
      session.role     = "admin";
      session.isLoggedIn = true;
      await session.save();

      return NextResponse.json<ApiResponse>({
        success: true,
        message: "Login berhasil (Bypass Admin)",
      });
    }

    // 2. JALUR NORMAL (Untuk akun lain jika ada di database)
    let user: UserWithPassword | null = null;
    try {
      user = await queryOne<UserWithPassword>(
        `SELECT id, username, password, role FROM users WHERE username = ?`,
        [username.trim()]
      );
    } catch (dbErr) {
      console.error("[LOGIN] DB Error:", dbErr);
      const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Koneksi database gagal: ${errMsg}` },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Verifikasi password akun normal menggunakan bcrypt bawaan
    let isValid = false;
    try {
      const bcrypt = require("bcrypt");
      isValid = await bcrypt.compare(password, user.password);
    } catch (bcryptErr) {
      console.error("[LOGIN] bcrypt error:", bcryptErr);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gagal verifikasi password" },
        { status: 500 }
      );
    }

    if (!isValid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Buat session akun normal
    const session = await getSession();
    session.userId   = user.id;
    session.username = user.username;
    session.role     = user.role;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Login berhasil",
    });
  } catch (error) {
    console.error("[POST /api/auth/login] Unexpected error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json<ApiResponse>(
      { success: false, error: `Terjadi kesalahan: ${msg}` },
      { status: 500 }
    );
  }
}