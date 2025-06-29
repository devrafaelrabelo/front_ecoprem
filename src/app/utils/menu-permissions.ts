import type { MenuData, MenuItem, SubMenuItem, ProcessedMenuData } from "@/types/menu"

/**
 * Verifica se o usuário tem todas as permissões necessárias
 */
export function hasRequiredPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every((permission) => userPermissions.includes(permission))
}

/**
 * Verifica quais ações o usuário pode realizar
 */
export function getAvailableActions(userPermissions: string[], actions: string[] = []) {
  return actions.map((action) => ({
    action,
    hasPermission: userPermissions.includes(action),
  }))
}

/**
 * Processa os dados do menu baseado nas permissões do usuário
 */
export function processMenuData(menuData: MenuData): ProcessedMenuData {
  const { permissions: userPermissions, menus } = menuData

  const processedMenus: MenuItem[] = menus.map((menu) => {
    const processedSubmenu: SubMenuItem[] = menu.submenu.map((subItem) => ({
      ...subItem,
      hasAccess: hasRequiredPermissions(userPermissions, subItem.requiredPermissions),
      availableActions: getAvailableActions(userPermissions, subItem.actions),
    }))

    // Filtra apenas subitens que o usuário tem acesso
    const accessibleSubmenu = processedSubmenu.filter((item) => item.hasAccess)

    return {
      title: menu.title,
      icon: menu.icon,
      submenu: accessibleSubmenu,
      hasAnyAccess: accessibleSubmenu.length > 0,
    }
  })

  // Filtra apenas menus que têm pelo menos um subitem acessível
  const accessibleMenus = processedMenus.filter((menu) => menu.hasAnyAccess)

  return {
    userPermissions,
    menus: accessibleMenus,
  }
}
