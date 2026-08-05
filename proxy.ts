import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Only apply to /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set!");
      return new NextResponse("Server misconfiguration: admin access unavailable.", { status: 500 });
    }

    const urlPassword = request.nextUrl.searchParams.get("password");

    // If the correct password is provided in the URL, set a cookie and redirect to clean URL
    if (urlPassword === adminPassword) {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return response;
    }

    // If no valid password in URL, check for the cookie
    const authCookie = request.cookies.get("admin_auth");
    if (authCookie?.value !== "true") {
      // Not authenticated
      return new NextResponse("Unauthorized. Please provide the correct password.", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
