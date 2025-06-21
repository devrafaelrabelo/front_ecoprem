"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, HomeIcon } from "lucide-react"
import { useAuth } from "@/features/auth/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, usePathname } from "next/navigation"
import { SYSTEMS_CONFIG, COMMON_NAV_ITEMS, getBreadcrumbItems, type SystemInfo } from "@/navigation/config"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { useEffect, useState } from "react"
import { ThemeSelector } from "./theme-selector"
import { BackendStatusIndicator } from "./backend-status-indicator"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  currentSystem: SystemInfo
}

export function SiteHeader({ currentSystem }: SiteHeaderProps) {
  const { logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbItems(pathname)
  const [selectedSystemId, setSelectedSystemId] = useSessionStorage<string | null>("selectedSystem", null)
  const [systemNavItems, setSystemNavItems] = useState<any[]>([])

  useEffect(() => {
    if (selectedSystemId && SYSTEMS_CONFIG[selectedSystemId]) {
      setSystemNavItems(SYSTEMS_CONFIG[selectedSystemId].items)
    } else {
      setSystemNavItems(SYSTEMS_CONFIG.none.items)
    }
  }, [selectedSystemId, pathname])

  const handleLogout = async () => {
    try {
      await logout()
      setSelectedSystemId(null) // Clear selected system on logout
      toast({
        variant: "success",
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
      })
    }
  }

  const displaySystemName = currentSystem.id === "none" ? "Seleção de Módulos" : currentSystem.name

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 p-4">
                <Link href="/modules" className="flex items-center gap-2 text-lg font-semibold">
                  <HomeIcon className="h-6 w-6" />
                  <span>{displaySystemName}</span>
                </Link>
                <div className="grid gap-2">
                  {systemNavItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                  {COMMON_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <nav className="hidden lg:flex items-center gap-4">
            <Link href="/modules" className="flex items-center gap-2 text-lg font-semibold">
              <HomeIcon className="h-6 w-6" />
              <span>{displaySystemName}</span>
            </Link>
            {breadcrumbs.length > 1 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.path}>
                    {index > 0 && <span className="mx-1">/</span>}
                    <Link href={crumb.path} className="hover:underline">
                      {crumb.title}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <BackendStatusIndicator />
          <ThemeSelector />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-6 w-6" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
