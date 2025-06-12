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

    if (pathname === "/modules") {
      return { id: "modules", name: "Seleção de Sistema", color: "text-custom-primary" }
    }

    return { id: "none", name: "SysAdmin", color: "text-custom-primary" }
  }, [pathname, systemRoutes])

  // Verificar se está em um sistema
  const isInSystem = useMemo(() => {
    return currentSystem.id !== "none" && currentSystem.id !== "modules"
  }, [currentSystem])

  // Verificar se está na seleção de sistema
  const ismodules = useMemo(() => {
    return pathname === "/modules"
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
  const backTomodules = useCallback(() => {
    router.push("/modules")
  }, [router])

  return {
    currentSystem,
    isInSystem,
    ismodules,
    navigateToSystem,
    backTomodules,
    pathname,
  }
}
