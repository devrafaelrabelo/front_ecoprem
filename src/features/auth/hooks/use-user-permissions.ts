"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { menuService } from "../services/menu-service"
import { getSystemFromPath } from "@/navigation/config"
import type { UserMenuData } from "../types/menu"

export function useUserPermissions() {
  const [menuData, setMenuData] = useState<UserMenuData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // Obter o sistema atual baseado na URL
  const currentSystem = useMemo(() => getSystemFromPath(pathname), [pathname])

  // Carregar permissões e menus
  const loadPermissions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("🔄 Carregando permissões...")

      // Verificar se menuService está disponível
      if (!menuService) {
        throw new Error("MenuService não está disponível")
      }

      if (typeof menuService.getUserPermissions !== "function") {
        throw new Error("Método getUserPermissions não está disponível no menuService")
      }

      const data = await menuService.getUserPermissions()

      if (data) {
        console.log("✅ Dados de permissões carregados:", data)
        setMenuData(data)
      } else {
        console.warn("🚫 Resposta de permissões foi null")
        setError("Não foi possível carregar as permissões")
      }
    } catch (err) {
      console.error("❌ Erro ao carregar permissões:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar permissões")
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar permissões na inicialização
  useEffect(() => {
    loadPermissions()
  }, [])

  // Filtrar menus do sistema atual
  const systemMenus = useMemo(() => {
    if (!menuData || !menuData.menus || !menuData.permissions) {
      console.log("📋 Nenhum menu ou permissões disponíveis ainda")
      return []
    }

    console.log(`🎯 Sistema atual: ${currentSystem.id}`)

    const systemIdForPathBuilding = currentSystem.id.toLowerCase()
    console.log(`🔧 Usando systemId para construção de paths: "${systemIdForPathBuilding}"`)

    try {
      const transformedAndFilteredMenus = menuService.transformUserMenus(
        menuData.menus,
        menuData.permissions,
        systemIdForPathBuilding,
      )

      console.log(`📊 Menus transformados e filtrados para ${currentSystem.id}:`, transformedAndFilteredMenus.length)
      return transformedAndFilteredMenus
    } catch (err) {
      console.error("❌ Erro ao transformar menus:", err)
      return []
    }
  }, [menuData, currentSystem])

  // Funções de verificação de permissões
  const hasPermission = (permission: string): boolean => {
    if (!menuData?.permissions) return false
    return menuService.hasPermission(menuData.permissions, permission)
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!menuData?.permissions) return false
    return menuService.hasAllPermissions(menuData.permissions, permissions)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!menuData?.permissions) return false
    return menuService.hasAnyPermission(menuData.permissions, permissions)
  }

  const getAvailableActions = (actions: string[]): string[] => {
    if (!menuData?.permissions) return []
    return menuService.getAvailableActions(menuData.permissions, actions)
  }

  const canPerformAction = (entity: string, action: string): boolean => {
    return hasPermission(`${entity}:${action}`)
  }

  // Função para recarregar permissões
  const refreshPermissions = () => {
    loadPermissions()
  }

  // Obter seções disponíveis
  const availableSections = useMemo(() => {
    if (!menuData?.menus) return []
    return menuService.getAvailableSections(menuData.menus)
  }, [menuData])

  return {
    // Dados
    permissions: menuData?.permissions || [],
    allMenus: menuData?.menus || [],
    systemMenus,
    availableSections,
    currentSystem,

    // Estados
    isLoading,
    error,

    // Funções de verificação
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getAvailableActions,
    canPerformAction,

    // Ações
    refreshPermissions,
  }
}

// Exportação padrão também para compatibilidade
export default useUserPermissions
