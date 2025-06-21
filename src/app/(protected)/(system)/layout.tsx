"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { SystemHeader } from "@/components/system-header"
import { DynamicSystemSidebar } from "@/components/dynamic-system-sidebar"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { getSystemFromPath, SYSTEMS_CONFIG } from "@/navigation/config"
import { useAuth } from "@/features/auth/context/auth-context"
import { FullScreenLoader } from "@/components/full-screen-loader"

const EXPANDED_SIDEBAR_WIDTH_CLASS = "sm:ml-64" // Corresponde a w-64 (256px)
const COLLAPSED_SIDEBAR_WIDTH_CLASS = "sm:ml-20" // Corresponde a w-20 (80px)

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading: authIsLoading, user } = useAuth()
  const [selectedSystemId, setSelectedSystemId] = useSessionStorage<string | null>("selectedSystem", null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Estado da sidebar agora gerenciado aqui para passar para o Header e Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useSessionStorage<boolean>("sidebarOpen", true)

  const currentSystem = getSystemFromPath(pathname)

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.replace("/login")
      } else if (!selectedSystemId && pathname !== "/modules") {
        const systemFromPath = getSystemFromPath(pathname)
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
        const systemFromPath = getSystemFromPath(pathname)
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

  useEffect(() => {
    if (currentSystem.id !== "none" && selectedSystemId !== currentSystem.id) {
      const userHasAccess = user?.departments?.some((dep) => dep.toUpperCase() === currentSystem.id.toUpperCase())
      if (userHasAccess) {
        setSelectedSystemId(currentSystem.id)
      }
    }
  }, [pathname, currentSystem.id, selectedSystemId, setSelectedSystemId, user])

  if (authIsLoading || isInitialLoading) {
    return <FullScreenLoader />
  }

  if (!isAuthenticated) {
    return null // O useEffect já redireciona, mas para garantir
  }

  // Se o usuário não tem acesso ao sistema atual, redireciona para /modules
  if (
    currentSystem.id !== "none" &&
    !user?.departments?.some((dep) => dep.toUpperCase() === currentSystem.id.toUpperCase())
  ) {
    router.replace("/modules")
    return <FullScreenLoader /> // Mostra loader durante o redirecionamento
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SystemHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={handleToggleSidebar} />
      <div className="flex flex-1 pt-16">
        {" "}
        {/* Adicionado pt-16 para compensar header fixo */}
        <DynamicSystemSidebar isOpen={isSidebarOpen} />
        <main
          className={cn(
            "flex-1 py-6 px-4 md:px-6 transition-[margin-left] duration-300 ease-in-out",
            isSidebarOpen ? EXPANDED_SIDEBAR_WIDTH_CLASS : COLLAPSED_SIDEBAR_WIDTH_CLASS,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
