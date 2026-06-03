import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ApiResponse } from "@/types";

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json<ApiResponse>({ success: true, message: "Logout berhasil" });
  } catch (error) {
    console.error("[POST /api/auth/logout]", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Gagal logout" }, { status: 500 });
  }
}
