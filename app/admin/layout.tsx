"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAdminAuthenticated, logoutAdmin } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = isAdminAuthenticated()
      setIsAuthenticated(authStatus)
      setIsLoading(false)

      // If not authenticated and not on login page, redirect to login
      if (!authStatus && !isLoginPage) {
        router.push("/admin/login")
      }
    }

    // Check immediately
    checkAuth()

    // Also check when the component mounts or pathname changes
    const interval = setInterval(checkAuth, 1000) // Check every second

    return () => clearInterval(interval)
  }, [router, isLoginPage, pathname])

  const handleLogout = () => {
    logoutAdmin()
    setIsAuthenticated(false)
    router.push("/admin/login")
  }

  // If it's the login page, just render it
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // If authenticated, show admin layout with logout button
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header with logout */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-600">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Admin content */}
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
