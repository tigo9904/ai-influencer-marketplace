import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAdminAuthenticatedFromCookies } from "./lib/auth"

// This middleware protects the admin routes
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path is for admin pages (except login)
  const isAdminPath = path.startsWith("/admin") && !path.startsWith("/admin/login")

  // If it's an admin path, check for authentication
  if (isAdminPath) {
    // Get the auth cookie
    const cookieString = request.headers.get("cookie") || ""
    const isAuthenticated = isAdminAuthenticatedFromCookies(cookieString)

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("redirect", path)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: ["/admin/:path*"],
}
