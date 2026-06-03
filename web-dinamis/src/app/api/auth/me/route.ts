import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ApiResponse, SessionData } from "@/types";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Tidak terautentikasi" }, { status: 401 });
    }
    return NextResponse.json<ApiResponse<Omit<SessionData, "isLoggedIn">>>({
      success: true,
      data: { userId: session.userId, username: session.username, role: session.role },
    });
  } catch (error) {
    console.error("[GET /api/auth/me]", error);
    return NextResponse.json<ApiResponse>({ success: false, error: "Gagal memeriksa sesi" }, { status: 500 });
  }
}
