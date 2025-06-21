"use client"

import { useState, useEffect } from "react"
import { menuService } from "@/features/auth/services/menu-service"
import type { UserMenuData, MenuItemWithPermissions } from "@/types/menu"
import { getSystemFromPath } from "@/navigation/config"
import { usePathname } from "next/navigation"

export function useUserMenus() {
  const pathname = usePathname()
  const currentSystem = getSystemFromPath(pathname)

  const [menuData, setMenuData] = useState<UserMenuData | null>(null)
  const [filteredMenus, setFilteredMenus] = useState<MenuItemWithPermissions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMenus = async () => {
      if (currentSystem.id === "none") {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const data = await menuService.getUserMenus(currentSystem.id)

        if (data) {
          setMenuData(data)
          const filtered = menuService.filterMenusByPermissions(data.menus, data.permissions)
          setFilteredMenus(filtered)
        } else {
          setError("Não foi possível carregar os menus")
        }
      } catch (err) {
        setError("Erro ao carregar menus")
        console.error("Erro ao carregar menus:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadMenus()
  }, [currentSystem.id])

  const hasPermission = (permission: string): boolean => {
    return menuData ? menuService.hasPermission(menuData.permissions, permission) : false
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return menuData ? menuService.hasAllPermissions(menuData.permissions, permissions) : false
  }

  const getAvailableActions = (actions: string[]): string[] => {
    return menuData ? menuService.getAvailableActions(menuData.permissions, actions) : []
  }

  return {
    menuData,
    filteredMenus,
    isLoading,
    error,
    hasPermission,
    hasAllPermissions,
    getAvailableActions,
    userPermissions: menuData?.permissions || [],
  }
}
