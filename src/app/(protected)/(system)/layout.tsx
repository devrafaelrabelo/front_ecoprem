"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { getSystemFromPath, SYSTEMS_CONFIG } from "@/navigation/config"
import { useAuth } from "@/features/auth/context/auth-context"
import { SystemHeader } from "@/components/system-header"
import { SystemSidebar } from "@/components/system-sidebar"

// Layout de sistema com card de conteúdo flutuante
export default function SystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuth()
  const [selectedSystemId, setSelectedSystemId] = useSessionStorage<string | null>("selectedSystem", null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useSessionStorage<boolean>("sidebarCollapsed", true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const currentSystem = getSystemFromPath(pathname)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.replace("/login")
        return
      }

      const systemFromPath = getSystemFromPath(pathname)
      if (!selectedSystemId && pathname !== "/modules") {
        if (systemFromPath.id !== "none") {
          const userHasAccess = user?.departments?.some((dep) => dep.toUpperCase() === systemFromPath.id.toUpperCase())
          if (userHasAccess) {
            setSelectedSystemId(systemFromPath.id)
          } else {
            router.replace("/modules")
          }
        } else {
          router.replace("/modules")
        }
      } else if (selectedSystemId && currentSystem.id !== selectedSystemId && currentSystem.id !== "none") {
        const userHasAccess = user?.departments?.some((dep) => dep.toUpperCase() === systemFromPath.id.toUpperCase())
        if (userHasAccess) {
          setSelectedSystemId(systemFromPath.id)
        } else {
          const fallbackPath = SYSTEMS_CONFIG[selectedSystemId as keyof typeof SYSTEMS_CONFIG]?.homePath || "/modules"
          router.replace(fallbackPath)
        }
      }
      setIsInitialLoading(false)
    }
  }, [authIsLoading, isAuthenticated, router, selectedSystemId, pathname, setSelectedSystemId, user, currentSystem.id])

  if (authIsLoading || isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <p className="text-lg">Carregando sistema...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (
    currentSystem.id !== "none" &&
    !user?.departments?.some((dep) => dep.toUpperCase() === currentSystem.id.toUpperCase())
  ) {
    router.replace("/modules")
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <p className="text-lg">Redirecionando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/50 dark:bg-[#0A0A0A]">
      {/* Header - sempre no topo e largura total */}
      <SystemHeader isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={handleToggleSidebar} />

      {/* Container para Sidebar e Conteúdo Principal */}
      <div className="flex flex-1">
        {/* Sidebar - fixo, posicionado abaixo do header */}
        <SystemSidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />

        {/* Área de conteúdo principal com fundo distinto e padding */}
        <main
          className={`flex-1 transition-all duration-300 pr-6 pb-6 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}
        >
          {/* Card flutuante para o conteúdo */}
          <div className="w-full h-full bg-card rounded-2xl shadow-md overflow-y-auto">
            <div className="p-6 sm:p-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
