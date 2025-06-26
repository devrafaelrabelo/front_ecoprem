"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { getSystemFromPath, SYSTEMS_CONFIG } from "@/navigation/config"
import { useAuth } from "@/features/auth/context/auth-context"
import { SystemHeader } from "@/components/system-header"

// Layout de sistema simplificado, sem sidebar.
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

  const currentSystem = getSystemFromPath(pathname)

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
      <div className="flex items-center justify-center min-h-screen">
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Redirecionando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SystemHeader />
      <main className="flex-1 py-6 px-4 md:px-6">{children}</main>
    </div>
  )
}
