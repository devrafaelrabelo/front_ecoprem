import Link from "next/link"
import { ThemeSelector } from "@/components/theme-selector"
import { APP_NAME, LOGO_URL } from "@/config"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <img src={LOGO_URL || "/placeholder.svg"} alt={`${APP_NAME} Logo`} className="h-8 w-8 object-contain" />
            <span className="inline-block font-bold">{APP_NAME}</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeSelector />
          </nav>
        </div>
      </div>
    </header>
  )
}
