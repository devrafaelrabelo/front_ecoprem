"use client"

import { usePathname, useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"

interface UseRouteManagementProps {
  systemRoutes?: {
    [key: string]: {
      name: string
      color: string
    }
  }
}

export function useRouteManagement({
  systemRoutes = {
    it: { name: "Sistema TI", color: "text-custom-secondary" },
    commercial: { name: "Sistema COMERCIAL", color: "text-custom-secondary" },
    hr: { name: "Sistema RH", color: "text-custom-secondary" },
    intranet: { name: "Intranet", color: "text-custom-secondary" },
  },
}: UseRouteManagementProps = {}) {
  const pathname = usePathname()
  const router = useRouter()

  // Determinar sistema atual com base no pathname
  const currentSystem = useMemo(() => {
    const systemKey = Object.keys(systemRoutes).find((key) => pathname.startsWith(`/${key}`))

    if (systemKey) {
      return {
        id: systemKey,
        ...systemRoutes[systemKey],
      }
    }

    if (pathname === "/system-selection") {
      return { id: "system-selection", name: "Seleção de Sistema", color: "text-custom-primary" }
    }

    return { id: "none", name: "SysAdmin", color: "text-custom-primary" }
  }, [pathname, systemRoutes])

  // Verificar se está em um sistema
  const isInSystem = useMemo(() => {
    return currentSystem.id !== "none" && currentSystem.id !== "system-selection"
  }, [currentSystem])

  // Verificar se está na seleção de sistema
  const isSystemSelection = useMemo(() => {
    return pathname === "/system-selection"
  }, [pathname])

  // Navegar para um sistema
  const navigateToSystem = useCallback(
    (systemId: string) => {
      const targetPath = systemId === "intranet" ? `/${systemId}/feed` : `/${systemId}/dashboard`
      router.push(targetPath)
    },
    [router],
  )

  // Voltar para a seleção de sistema
  const backToSystemSelection = useCallback(() => {
    router.push("/system-selection")
  }, [router])

  return {
    currentSystem,
    isInSystem,
    isSystemSelection,
    navigateToSystem,
    backToSystemSelection,
    pathname,
  }
}
