import { config } from "@/config"
import type { UserMenuData, MenuGroup, SubMenuItem, MenuItemWithPermissions } from "../types/menu"

// Mapeamento de actions para rotas e labels
const ACTION_MAPPINGS = {
  // User actions
  "user:create": { path: "/create", label: "Criar Usuários", icon: "UserPlus" },
  "user:update": { path: "/edit", label: "Editar Usuários", icon: "UserPen" },
  "user:delete": { path: "/delete", label: "Excluir Usuários", icon: "UserX" },
  "user:view": { path: "/list", label: "Listar Usuários", icon: "Users" },

  // Generic actions
  create: { path: "/create", label: "Criar", icon: "Plus" },
  update: { path: "/edit", label: "Editar", icon: "Edit" },
  delete: { path: "/delete", label: "Excluir", icon: "Trash2" },
  view: { path: "/list", label: "Listar", icon: "List" },
  list: { path: "/list", label: "Listar", icon: "List" },
  manage: { path: "/manage", label: "Gerenciar", icon: "Settings" },
  report: { path: "/reports", label: "Relatórios", icon: "FileText" },
  export: { path: "/export", label: "Exportar", icon: "Download" },
  import: { path: "/import", label: "Importar", icon: "Upload" },
} as const

export const menuService = {
  // Fazer chamada real para o backend
  getUserPermissions: async (): Promise<UserMenuData | null> => {
    try {
      console.log(`🔍 Buscando permissões do usuário em: ${config.api.baseUrl}/api/user/permissions`)

      const response = await fetch(`${config.api.baseUrl}/api/user/permissions`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        signal: AbortSignal.timeout(10000),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Resposta do backend:`, data)

        // Verificar se a resposta tem a estrutura esperada
        if (data && data.permissions && Array.isArray(data.menus)) {
          console.log(`✅ Permissões e menus carregados (estrutura direta):`, data)
          return data as UserMenuData
        }

        // Verificar se tem wrapper de sucesso
        if (data.success && data.data && data.data.permissions && Array.isArray(data.data.menus)) {
          console.log(`✅ Permissões e menus carregados (com wrapper):`, data.data)
          return data.data as UserMenuData
        }

        console.warn(`🚫 Estrutura de resposta inesperada:`, data)
        return null
      }

      if (response.status === 401) {
        console.warn(`🚫 Usuário não autenticado`)
        return null
      }

      console.warn(`🚫 Falha ao carregar permissões. Status: ${response.status}`)
      return null
    } catch (error) {
      console.error(`❌ Erro ao buscar permissões:`, error)
      return null
    }
  },

  hasPermission: (userPermissions: string[], requiredPermission: string): boolean => {
    return userPermissions.includes(requiredPermission)
  },

  hasAllPermissions: (userPermissions: string[], requiredPermissions: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true
    return requiredPermissions.every((permission) => userPermissions.includes(permission))
  },

  hasAnyPermission: (userPermissions: string[], requiredPermissions: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true
    return requiredPermissions.some((permission) => userPermissions.includes(permission))
  },

  getAvailableActions: (userPermissions: string[], actions: string[]): string[] => {
    if (!actions || actions.length === 0) return []
    return actions.filter((action) => userPermissions.includes(action))
  },

  buildFullPath: (menuPath: string, systemId: string): string => {
    console.log(`🔧 buildFullPath chamado com: menuPath="${menuPath}", systemId="${systemId}"`)

    const effectiveMenuPath = (typeof menuPath === "string" ? menuPath : "").replace(/^\/+|\/+$/g, "")
    const effectiveSystemId = (typeof systemId === "string" ? systemId : "").replace(/^\/+|\/+$/g, "")

    if (!effectiveSystemId) {
      const result = effectiveMenuPath ? `/${effectiveMenuPath}` : "/"
      console.log(`   resultado sem systemId: "${result}"`)
      return result
    }

    const finalPathSegments: string[] = []

    if (effectiveMenuPath.startsWith(effectiveSystemId + "/") || effectiveMenuPath === effectiveSystemId) {
      finalPathSegments.push(...effectiveMenuPath.split("/").filter(Boolean))
    } else {
      finalPathSegments.push(effectiveSystemId)
      if (effectiveMenuPath) {
        finalPathSegments.push(...effectiveMenuPath.split("/").filter(Boolean))
      }
    }

    const constructedPath = finalPathSegments.join("/")
    const fullPath = constructedPath ? `/${constructedPath}` : "/"
    console.log(`   resultado final: "${fullPath}"`)
    return fullPath
  },

  actionToMenuItem: (
    action: string,
    baseMenuPath: string,
    systemId: string,
    parentIcon: string,
  ): MenuItemWithPermissions => {
    console.log(`🎯 actionToMenuItem: action="${action}", baseMenuPath="${baseMenuPath}", systemId="${systemId}"`)

    const [entity, actionType] = action.split(":")
    const mapping =
      ACTION_MAPPINGS[action as keyof typeof ACTION_MAPPINGS] ||
      ACTION_MAPPINGS[actionType as keyof typeof ACTION_MAPPINGS]

    if (mapping) {
      const actionPath = `${baseMenuPath}${mapping.path}`
      const fullPath = menuService.buildFullPath(actionPath, systemId)

      return {
        label: mapping.label,
        icon: mapping.icon,
        path: fullPath,
        requiredPermissions: [action],
        section: entity?.toUpperCase() || "GENERAL",
        hasAccess: true,
        level: 2,
      }
    }

    // Fallback para actions não mapeadas
    const actionPath = `${baseMenuPath}/${actionType}`
    const fullPath = menuService.buildFullPath(actionPath, systemId)

    return {
      label: actionType.charAt(0).toUpperCase() + actionType.slice(1),
      icon: parentIcon || "Circle",
      path: fullPath,
      requiredPermissions: [action],
      section: entity?.toUpperCase() || "GENERAL",
      hasAccess: true,
      level: 2,
    }
  },

  processSubMenuItem: (
    subItem: SubMenuItem,
    userPermissions: string[],
    systemId: string,
    parentSection: string,
    level: number,
  ): MenuItemWithPermissions | null => {
    const hasSubItemAccess = menuService.hasAllPermissions(userPermissions, subItem.requiredPermissions)
    if (!hasSubItemAccess) {
      console.log(`🚫 SubMenu "${subItem.label}" bloqueado - sem permissão`)
      return null
    }

    const availableActions = menuService.getAvailableActions(userPermissions, subItem.actions || [])
    let actionChildren: MenuItemWithPermissions[] | undefined = undefined

    const fullSubItemPath = menuService.buildFullPath(subItem.path, systemId)

    if (availableActions.length > 0) {
      actionChildren = availableActions.map((action) =>
        menuService.actionToMenuItem(action, subItem.path, systemId, subItem.icon),
      )
    }

    let childrenForSubItem: MenuItemWithPermissions[] | undefined = actionChildren
    const isGroupItem = availableActions.length > 0

    if (isGroupItem && actionChildren) {
      const overviewItem: MenuItemWithPermissions = {
        label: "Visão Geral",
        icon: subItem.icon,
        path: fullSubItemPath,
        requiredPermissions: subItem.requiredPermissions,
        section: parentSection,
        hasAccess: true,
        level: level + 1,
      }
      childrenForSubItem = [overviewItem, ...actionChildren]
    }

    return {
      label: subItem.label,
      icon: subItem.icon,
      path: fullSubItemPath,
      requiredPermissions: subItem.requiredPermissions,
      actions: subItem.actions,
      section: parentSection,
      hasAccess: true,
      availableActions: availableActions,
      children: childrenForSubItem,
      isGroup: isGroupItem,
      isCollapsible: isGroupItem,
      level: level,
      order: subItem.order,
      badge: subItem.badge,
      description: subItem.description,
    }
  },

  transformUserMenus: (
    menuGroups: MenuGroup[],
    userPermissions: string[],
    systemId: string,
  ): MenuItemWithPermissions[] => {
    console.log(`🔄 Transformando MenuGroups para o sistema: "${systemId}"`)
    console.log(`📋 MenuGroups recebidos:`, menuGroups)
    console.log(`🔑 Permissões do usuário:`, userPermissions)

    return menuGroups
      .map((group, groupIndex) => {
        console.log(`🔄 Processando grupo: "${group.title}"`)

        const processedSubMenus = group.submenu
          .map((subItem) =>
            menuService.processSubMenuItem(subItem, userPermissions, systemId, group.title.toUpperCase(), 1),
          )
          .filter((item): item is MenuItemWithPermissions => item !== null)

        if (processedSubMenus.length === 0) {
          console.log(`🚫 Grupo "${group.title}" sem submenus acessíveis. Ocultando grupo.`)
          return null
        }

        const groupPath = processedSubMenus[0]?.path

        return {
          label: group.title,
          icon: group.icon,
          path: groupPath,
          requiredPermissions: [],
          section: group.title.toUpperCase(),
          hasAccess: true,
          children: processedSubMenus,
          isGroup: true,
          isCollapsible: true,
          level: 0,
          order: groupIndex,
        }
      })
      .filter((item): item is MenuItemWithPermissions => item !== null)
  },

  groupMenusBySection: (menus: MenuItemWithPermissions[]): Record<string, MenuItemWithPermissions[]> => {
    return menus.reduce(
      (acc, menu) => {
        const section = menu.section
        if (!acc[section]) acc[section] = []
        acc[section].push(menu)
        return acc
      },
      {} as Record<string, MenuItemWithPermissions[]>,
    )
  },

  getAvailableSections: (menus: MenuItemWithPermissions[]): string[] => {
    return [...new Set(menus.map((menu) => menu.section))]
  },
}
