export interface MenuAction {
  action: string
  hasPermission: boolean
}

export interface SubMenuItem {
  label: string
  icon: string
  path: string
  requiredPermissions: string[]
  actions?: string[]
  hasAccess: boolean
  availableActions: MenuAction[]
}

export interface MenuItem {
  title: string
  icon: string
  submenu: SubMenuItem[]
  hasAnyAccess: boolean
}

export interface MenuData {
  permissions: string[]
  menus: {
    title: string
    icon: string
    submenu: {
      label: string
      icon: string
      path: string
      requiredPermissions: string[]
      actions?: string[]
    }[]
  }[]
}

export interface ProcessedMenuData {
  userPermissions: string[]
  menus: MenuItem[]
}
