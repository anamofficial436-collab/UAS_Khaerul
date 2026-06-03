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
    const { username, password } = await request.json();

    if (!username?.trim() || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await queryOne<UserWithPassword>(
      `SELECT id, username, password, role FROM users WHERE username = ?`,
      [username.trim()]
    );

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Verifikasi password dengan bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Buat session
    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    session.role = user.role;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Login berhasil",
    });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
