// Simple authentication for admin access only

// In a real production app, you would use a more secure method
// This is a simplified version for demonstration purposes

// Store admin credentials in environment variables in production
const ADMIN_USERNAME = "Design@imagineeduction.io"
const ADMIN_PASSWORD = "DIE.2025.AMP?." // Change this to a strong password

// Session storage key
export const AUTH_SESSION_KEY = "ai-influencer-admin-auth"

// Admin authentication interface
export interface AdminAuth {
  isAuthenticated: boolean
  username: string | null
  timestamp: number | null
}

// Login function
export function loginAdmin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Create session
    const session: AdminAuth = {
      isAuthenticated: true,
      username: username,
      timestamp: Date.now(),
    }

    // Store in session storage (will be cleared when browser is closed)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
    }

    return true
  }
  return false
}

// Logout function
export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(AUTH_SESSION_KEY)
  }
}

// Check if admin is logged in
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const sessionData = sessionStorage.getItem(AUTH_SESSION_KEY)
  if (!sessionData) {
    return false
  }

  try {
    const session: AdminAuth = JSON.parse(sessionData)

    // Check if session is valid and not expired (24 hour expiry)
    const now = Date.now()
    const sessionAge = now - (session.timestamp || 0)
    const sessionValid = sessionAge < 24 * 60 * 60 * 1000 // 24 hours

    return session.isAuthenticated && sessionValid
  } catch (error) {
    return false
  }
}
