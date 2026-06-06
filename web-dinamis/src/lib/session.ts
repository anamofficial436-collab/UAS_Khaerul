import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "@/types";

// ============================================================
// Session Configuration
// ============================================================

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "lapor-id-fallback-secret-min-32-chars!!",
  cookieName: "lapor_id_session",
  cookieOptions: {
  secure: false, // <-- WAJIB FALSE di lokal agar pas di-push ke AWS tetap mengizinkan HTTP biasa!
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 8, // 8 jam
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  return session as SessionData;
}
