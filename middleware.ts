import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware protects the admin routes
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if the path is for admin pages (except login)
  const isAdminPath = path.startsWith("/admin") && !path.startsWith("/admin/login")

  // If it's an admin path, check for authentication
  if (isAdminPath) {
    // Get the auth session from cookies
    const authSession = request.cookies.get("ai-influencer-admin-auth")?.value

    // If no session or invalid session, redirect to login
    if (!authSession) {
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("redirect", path)
      return NextResponse.redirect(url)
    }

    try {
      // Parse the session
      const session = JSON.parse(authSession)

      // Check if session is valid and not expired (24 hour expiry)
      const now = Date.now()
      const sessionAge = now - (session.timestamp || 0)
      const sessionValid = sessionAge < 24 * 60 * 60 * 1000 // 24 hours

      if (!session.isAuthenticated || !sessionValid) {
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("redirect", path)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // If there's an error parsing the session, redirect to login
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
