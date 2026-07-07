import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply to /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const urlPassword = request.nextUrl.searchParams.get("password");
    
    // If the correct password is provided in the URL, set a cookie and redirect to clean URL
    if (urlPassword === "653194") {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
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
