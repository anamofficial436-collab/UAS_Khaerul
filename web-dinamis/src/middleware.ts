import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Middleware: Route Protection (Cookie-based first-pass check)
// Validasi session penuh dilakukan di dashboard/layout.tsx
// ============================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("lapor_id_session");
    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/login") {
    const sessionCookie = request.cookies.get("lapor_id_session");
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
