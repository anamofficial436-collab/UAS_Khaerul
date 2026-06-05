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

    // Test koneksi DB dulu sebelum query
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

    // Verifikasi password
    let isValid = false;
    try {
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

    // Buat session
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
