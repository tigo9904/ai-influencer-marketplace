import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-purple-600">
          <Image
            src="/logo.png"
            alt="AI Influencer Hub Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          AI Influencer Hub
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 active:scale-95"
            >
              <Settings className="h-4 w-4" />
              Admin Panel
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
